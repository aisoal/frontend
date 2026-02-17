import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { typeOptions } from "./options";

const formatDuration = (val) => {
  if (val === null || val === undefined) return "N/A";
  const num = parseFloat(val);
  return !isNaN(num) ? `${num.toFixed(2)}s` : "N/A";
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toISOString().replace("T", " ").substring(0, 19);
};

const getFilename = (session, extension) => {
  let base = "hasil-soal";
  if (session) {
    if (session.model && session.filename) {
      const name = session.filename;
      const lastDot = name.lastIndexOf(".");
      const nameWithoutExt = lastDot > 0 ? name.substring(0, lastDot) : name;
      base = `${session.model}_${nameWithoutExt}`;
    } else if (session.title) {
      base = session.title;
    }
  }
  const sanitizedBase = base.replace(/[/\\?%*:|"<>]/g, "_");
  return `${sanitizedBase}.${extension}`;
};

const standardizeQuestion = (q) => {
  let parsedKeywords = q.keywords;
  if (typeof parsedKeywords === "string") {
    try {
      parsedKeywords = JSON.parse(parsedKeywords);
    } catch (e) {
      parsedKeywords = [];
    }
  }
  let parsedOptions = q.options;
  if (typeof parsedOptions === "string") {
    try {
      parsedOptions = JSON.parse(parsedOptions);
    } catch (e) {
      parsedOptions = [];
    }
  }

  return {
    id: q.id,
    log_id: q.log_id,
    question: q.question,
    options: Array.isArray(parsedOptions) ? parsedOptions : [],
    answer: q.answer,
    explanation: q.explanation,
    source_text: q.source_text,
    keywords: Array.isArray(parsedKeywords) ? parsedKeywords : [],
    difficulty: q.difficulty,
    type: q.type,
    language: q.language,
    source: q.source,
    confidence: q.confidence,
    duration: q.duration,
  };
};

export const formatQuestion = (q, i) => {
  const opts =
    q.options
      ?.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`)
      .join("\n") || "";
  const keywords = q.keywords?.map((k) => `#${k}`).join(", ") || "-";

  return `${i + 1}. ${q.question}
${opts}
Jawaban: ${q.answer}
Penjelasan: ${q.explanation || "-"}
Sumber Teks: ${q.source_text || "-"}
Model: ${q.model}
Sumber: ${q.source}
Estimasi Pengerjaan: ${q.duration || "-"}
Tingkat Kepercayaan: ${q.confidence || "-"}
ID Soal: ${q.id}
Keywords: ${keywords}
------------------------------------------------------------`;
};

const formatEnhancedSessionDetailsText = (session) => {
  if (!session) return "";
  const stats = session.confidenceStats || {};
  const dist = session.questionTypeDistribution || {};
  const effStats = session.efficiencyStats || {};

  const formatPercent = (val) => {
    if (val === null || val === undefined) return "N/A";
    const num = parseFloat(val);
    if (isNaN(num)) return "N/A";
    const finalValue = num > 1 ? num : num * 100;
    return `${Math.min(finalValue, 100).toFixed(2)}%`;
  };

  const distributionText = typeOptions
    .filter((opt) => opt.value !== "all")
    .map((opt) => `- ${opt.label}: ${dist[opt.value] || 0}`)
    .join("\n");

  return `\n\n============================================================
Rincian Sesi
============================================================
Judul: ${session.title || "-"}
Tanggal Pembuatan: ${formatDate(session.created_at)}
File: ${session.filename || "-"}
Model: ${session.model || "-"}

Jumlah Total Soal Dihasilkan: ${session.total_questions || "N/A"}

Distribusi Tipe Soal
${distributionText}

Kinerja Kepercayaan (Confidence)
- Kepercayaan Tertinggi: ${formatPercent(stats.max)}
- Kepercayaan Terendah: ${formatPercent(stats.min)}
- Rata-rata: ${formatPercent(stats.avg)}

Kinerja Efisiensi Generasi
- Waktu Tercepat: ${formatDuration(effStats.fastest)}
- Waktu Terlama: ${formatDuration(effStats.slowest)}
- Rata-rata: ${formatDuration(effStats.avg)}
============================================================`;
};

const generateWordBlob = async (logs, session) => {
  let overallIndex = 0;
  const sessionDetailsContent = formatEnhancedSessionDetailsText(session)
    .split("\n")
    .filter((line) => line !== null);

  const doc = new Document({
    sections: [
      {
        children: [
          ...logs.flatMap((log, logIndex) => {
            const batchHeader = [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Batch #${logIndex + 1}`,
                    bold: true,
                    size: 28,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Halaman: ${log.pages}, Durasi AI: ${log.duration}s`,
                    size: 20,
                    color: "555555",
                  }),
                ],
              }),
              new Paragraph({ text: "" }),
            ];
            const questionParagraphs = log.questions.flatMap((q) => {
              const content = formatQuestion(q, overallIndex++).split("\n");
              return content.map(
                (text) => new Paragraph({ children: [new TextRun(text)] })
              );
            });
            return [...batchHeader, ...questionParagraphs];
          }),
          new Paragraph({ children: [new TextRun({ text: "", break: 1 })] }),
          ...sessionDetailsContent.map(
            (text) => new Paragraph({ children: [new TextRun(text)] })
          ),
        ],
      },
    ],
  });
  return Packer.toBlob(doc);
};

const generatePdfBlob = (logs, session) => {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  let y = 10;
  const margin = 15;
  const lineHeight = 7;
  const pageHeight = 280;

  const addTextWithPageCheck = (textLines) => {
    textLines.forEach((line) => {
      if (y + lineHeight > pageHeight) {
        pdf.addPage();
        y = 10;
      }
      pdf.text(line, margin, y);
      y += lineHeight;
    });
  };

  let overallIndex = 0;
  logs.forEach((log, logIndex) => {
    const batchHeader = `Batch #${logIndex + 1} (Halaman: ${
      log.pages
    }, Durasi AI: ${log.duration}s)`;
    pdf.setFont("helvetica", "bold");
    addTextWithPageCheck([batchHeader]);
    pdf.setFont("helvetica", "normal");
    y += 3;

    log.questions.forEach((q) => {
      const text = formatQuestion(q, overallIndex++);
      const lines = pdf.splitTextToSize(text, 180);
      addTextWithPageCheck(lines);
      y += 5;
    });
  });

  if (session) {
    const sessionText = formatEnhancedSessionDetailsText(session);
    const sessionLines = pdf.splitTextToSize(sessionText, 180);
    addTextWithPageCheck(sessionLines);
  }
  return pdf.output("blob");
};

const generateTxtBlob = (logs, session) => {
  let content = "";
  let overallIndex = 0;
  logs.forEach((log, logIndex) => {
    content += `====================\nBatch #${logIndex + 1} (Halaman: ${
      log.pages
    }, Durasi AI: ${log.duration}s)\n====================\n\n`;
    log.questions.forEach((q) => {
      content += formatQuestion(q, overallIndex++);
      content += "\n\n";
    });
  });
  const sessionDetails = formatEnhancedSessionDetailsText(session);
  return new Blob([content + sessionDetails], {
    type: "text/plain;charset=utf-8",
  });
};

const flattenDataForSheet = (logs) => {
  let overallIndex = 0;
  return logs.flatMap((log) =>
    log.questions.map((q) => ({
      no: ++overallIndex,
      ...standardizeQuestion(q),
      log_id: log.id,
      log_duration: log.duration,
      log_pages: `="${log.pages}"`,
      log_input_tokens: log.input_tokens,
      template_id: log.template_id,
      template_text: log.template_text,
    }))
  );
};

const generateCsvBlob = (logs) => {
  const flatData = flattenDataForSheet(logs);
  const headers = Object.keys(flatData[0] || {});
  const ws = XLSX.utils.json_to_sheet(flatData, { header: headers });
  const csvOutput = XLSX.utils.sheet_to_csv(ws);
  return new Blob([csvOutput], { type: "text/csv;charset=utf-8" });
};

const generateXlsxBlob = (logs, session) => {
  const flatData = flattenDataForSheet(logs);
  const ws = XLSX.utils.json_to_sheet(flatData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "questions");

  if (session) {
    const sessionDetails = [
      { Key: "Session ID", Value: session.id },
      { Key: "User ID", Value: session.user_id },
    ];
    const sessionWs = XLSX.utils.json_to_sheet(sessionDetails);
    XLSX.utils.book_append_sheet(wb, sessionWs, "session_details");
  }
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new Blob([wbout], { type: "application/octet-stream" });
};

const generateJsonBlob = (logs, session) => {
  const cleanSession = {
    id: session.id,
    user_id: session.user_id,
    title: session.title,
    filename: session.filename,
    model: session.model,
    created_at: session.created_at,
    total_questions: session.total_questions,
    confidence_stats: session.confidenceStats,
    question_type_distribution: session.questionTypeDistribution,
    efficiency_stats: session.efficiencyStats,
  };

  const data = {
    session_details: {
      ...cleanSession,
      logs: logs.map((log) => ({
        id: log.id,
        duration: log.duration,
        pages: log.pages,
        input_tokens: log.input_tokens,
        output_tokens: log.output_tokens,
        total_tokens: log.total_tokens,
        question_count: log.question_count,
        created_at: log.created_at,
        template_id: log.template_id,
        template_text: log.template_text,
        questions: log.questions.map(standardizeQuestion),
      })),
    },
  };

  const json = JSON.stringify(data, null, 2);
  return new Blob([json], { type: "application/json;charset=utf-8" });
};

export const exportToWord = async (logs, session) => {
  const blob = await generateWordBlob(logs, session);
  saveAs(blob, getFilename(session, "docx"));
};
export const exportToPDF = (logs, session) => {
  const blob = generatePdfBlob(logs, session);
  saveAs(blob, getFilename(session, "pdf"));
};
export const exportToTxt = (logs, session) => {
  const blob = generateTxtBlob(logs, session);
  saveAs(blob, getFilename(session, "txt"));
};
export const exportToCSV = (logs, session) => {
  const blob = generateCsvBlob(logs, session);
  saveAs(blob, getFilename(session, "csv"));
};
export const exportToJSON = (logs, session) => {
  const blob = generateJsonBlob(logs, session);
  saveAs(blob, getFilename(session, "json"));
};
export const exportToXLSX = (logs, session) => {
  const blob = generateXlsxBlob(logs, session);
  saveAs(blob, getFilename(session, "xlsx"));
};

export const exportAllSessionsToZipByType = async (sessionsData, format) => {
  const zip = new JSZip();
  const formatGenerators = {
    docx: generateWordBlob,
    pdf: generatePdfBlob,
    txt: generateTxtBlob,
    csv: generateCsvBlob,
    json: generateJsonBlob,
    xlsx: generateXlsxBlob,
  };

  const generator = formatGenerators[format];
  if (!generator) throw new Error(`Invalid export format: ${format}`);

  for (const session of sessionsData) {
    if (!session.logs || session.logs.length === 0) continue;

    // 1. TENTUKAN NAMA FOLDER (Berdasarkan Model)
    // Jika model kosong, masukkan ke folder "Unknown"
    const modelFolderName = (session.model || "Unknown_Model").replace(
      /[/\\?%*:|"<>]/g,
      "_"
    );

    // 2. TENTUKAN NAMA FILE (Berdasarkan Title + ID)
    // Kita tambahkan ID di belakang Judul agar jika ada 2 file judulnya "essay"
    // di dalam folder model yang sama, mereka TIDAK saling menimpa.
    const safeTitle = (session.title || "Untitled").replace(
      /[/\\?%*:|"<>]/g,
      "_"
    );
    const uniqueFileName = `${safeTitle}_${session.id}.${format}`;

    // Persiapkan data untuk export
    const sessionForExport = {
      ...session,
      total_questions: session.totalQuestions,
      confidenceStats: {
        max: session.maxConfidence,
        min: session.minConfidence,
        avg: session.avgConfidence,
      },
      efficiencyStats: {
        fastest: session.minDuration,
        slowest: session.maxDuration,
        avg: session.avgDuration,
      },
      questionTypeDistribution: {
        essay: session.essayCount,
        "fill-in-the-blank": session.fillInTheBlankCount,
        "true-false": session.trueFalseCount,
        "multiple-choice": session.multipleChoiceCount,
      },
    };

    // Generate konten file (Blob)
    const blob = await generator(session.logs, sessionForExport);

    // 3. MASUKKAN KE DALAM ZIP
    // Logikanya: Buka folder model -> Masukkan file
    zip.folder(modelFolderName).file(uniqueFileName, blob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const zipFilename = `Aisoal_All_Sessions_${formatDate(new Date())
    .replace(/[: ]/g, "_")
    .replace(/-/g, "")}.zip`;
  saveAs(zipBlob, zipFilename);
};
