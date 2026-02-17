import { useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import {
  TimeIcon,
  HamburgerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  DeleteIcon,
  CheckIcon,
  CloseIcon,
  SearchIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import AuthContext from "../../context/AuthContext";
import api from "../../api";
import { CiChat1, CiLogout } from "react-icons/ci";
import { MdOutlineHistory, MdOutlineQueryStats } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { BsFillGrid3X3GapFill, BsTable } from "react-icons/bs";
import {
  FaTrophy,
  FaBolt,
  FaDownload,
  FaFileWord,
  FaFileArchive,
} from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table as DocxTable,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels,
);

const ITEMS_PER_PAGE = 8;

const formatPercent = (value) => {
  if (value === null || value === undefined) return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  const finalValue = num > 1 ? num : num * 100;
  return `${Math.min(finalValue, 100).toFixed(1)}%`;
};

const formatDuration = (value) => {
  if (value === null || value === undefined) return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  return `${num.toFixed(1)}s`;
};

const CHART_COLORS = [
  "#4299E1",
  "#F6E05E",
  "#48BB78",
  "#ED8936",
  "#9F7AEA",
  "#F56565",
  "#38B2AC",
  "#ECC94B",
  "#63B3ED",
  "#D69E2E",
  "#B794F4",
  "#FC8181",
  "#319795",
  "#D69E2E",
  "#667EEA",
  "#F56565",
];

const LeftSidebarContent = ({ user, onLogoutClick, isLoggingOut }) => (
  <VStack align="stretch" spacing={4} h="full">
    <Box flex="1">
      <Heading size="md" color="teal.700">
        📄 AIsoal
      </Heading>
      <VStack align="stretch" spacing={2} mt={6}>
        <Button
          as={RouterLink}
          to="/"
          justifyContent="flex-start"
          variant="ghost"
          leftIcon={<Icon as={CiChat1} />}
        >
          New
        </Button>
        {user && (
          <>
            <Button
              as={RouterLink}
              to="/stats"
              justifyContent="flex-start"
              variant="ghost"
              leftIcon={<Icon as={MdOutlineQueryStats} />}
            >
              Stats
            </Button>
            <Button
              as={RouterLink}
              to="/history"
              justifyContent="flex-start"
              variant="solid"
              colorScheme="teal"
              leftIcon={<Icon as={MdOutlineHistory} />}
            >
              Riwayat
            </Button>
          </>
        )}
        <Button
          as={RouterLink}
          to="/about"
          justifyContent="flex-start"
          variant="ghost"
          leftIcon={<Icon as={IoMdInformationCircleOutline} />}
        >
          About
        </Button>
      </VStack>
    </Box>
    {user && (
      <Box>
        <Divider my={4} />
        <Text fontSize="sm" noOfLines={1} title={user.email}>
          {user.email}
        </Text>
        <Text fontSize="xs" color="gray.500">
          Generasi: {user.generation_count} / 5
        </Text>
        <Button
          mt={3}
          w="full"
          variant="ghost"
          colorScheme="red"
          justifyContent="flex-start"
          size="sm"
          leftIcon={<Icon as={CiLogout} />}
          onClick={onLogoutClick}
          isLoading={isLoggingOut}
        >
          Logout
        </Button>
      </Box>
    )}
  </VStack>
);

const HistoryItemCard = ({
  item,
  onDeleteClick,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onTitleChange,
  isEditing,
  newTitle,
  isSaving,
  isSelected,
  onSelect,
  visibility,
}) => {
  const { id, title, model, ...stats } = item;
  const DetailSection = ({ title, data }) => (
    <Box w="full">
      <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={2}>
        {title}
      </Text>
      <VStack align="stretch" spacing={1} fontSize="sm">
        {data.map((item) => (
          <Flex key={item.label} justify="space-between">
            <Text color="gray.500">{item.label}</Text>
            <Text fontWeight="medium" color="gray.800">
              {item.value}
            </Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
  return (
    <VStack
      p={5}
      pl={3}
      borderWidth={1}
      borderRadius="xl"
      shadow="xs"
      bg={isSelected ? "teal.50" : "white"}
      borderColor={isSelected ? "teal.200" : "gray.200"}
      w="full"
      _hover={{
        shadow: "md",
        borderColor: "teal.300",
        transform: "translateY(-2px)",
      }}
      transition="all 0.2s"
      align="stretch"
      spacing={3}
      position="relative"
    >
      <Checkbox
        isChecked={isSelected}
        onChange={() => onSelect(id)}
        position="absolute"
        top="20px"
        left="20px"
        size="lg"
        colorScheme="teal"
        onClick={(e) => e.stopPropagation()}
      />
      <Flex justify="space-between" align="center" minH="50px" ml="40px">
        {isEditing ? (
          <HStack flex="1" spacing={2}>
            <Input
              value={newTitle}
              onChange={onTitleChange}
              size="sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") onSaveClick(id);
                if (e.key === "Escape") onCancelClick();
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <IconButton
              icon={<CheckIcon />}
              size="sm"
              colorScheme="teal"
              aria-label="Simpan judul"
              onClick={(e) => {
                e.stopPropagation();
                onSaveClick(id);
              }}
              isLoading={isSaving}
            />
            <IconButton
              icon={<CloseIcon />}
              size="sm"
              aria-label="Batal edit"
              onClick={(e) => {
                e.stopPropagation();
                onCancelClick();
              }}
            />
          </HStack>
        ) : (
          <>
            <Box
              as={RouterLink}
              to={`/c/${id}`}
              flex="1"
              _hover={{ textDecoration: "none" }}
            >
              <Heading
                size="sm"
                color="gray.800"
                noOfLines={2}
                title={title}
                _hover={{ color: "teal.600" }}
              >
                {title}
              </Heading>
              <Code fontSize="xs" colorScheme="gray" mt={1}>
                {model}
              </Code>
            </Box>
            <HStack spacing={1}>
              <IconButton
                icon={<EditIcon />}
                size="xs"
                variant="ghost"
                aria-label="Edit judul"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onEditClick(item);
                }}
              />
              <IconButton
                icon={<DeleteIcon />}
                size="xs"
                variant="ghost"
                colorScheme="red"
                aria-label="Hapus sesi"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDeleteClick(id);
                }}
              />
            </HStack>
          </>
        )}
      </Flex>
      <VStack ml="40px" align="stretch" spacing={3}>
        <Divider />
        {visibility.includes("total") && (
          <>
            <DetailSection
              title={`Total Soal: ${stats.totalQuestions.toLocaleString()}`}
              data={[
                {
                  label: "Pilihan Ganda",
                  value: stats.multipleChoiceCount.toLocaleString(),
                },
                { label: "Esai", value: stats.essayCount.toLocaleString() },
                {
                  label: "Benar/Salah",
                  value: stats.trueFalseCount.toLocaleString(),
                },
                {
                  label: "Isian",
                  value: stats.fillInTheBlankCount.toLocaleString(),
                },
              ]}
            />
            <Divider />
          </>
        )}
        {visibility.includes("confidence") && (
          <>
            <DetailSection
              title="Kinerja Kepercayaan"
              data={[
                {
                  label: "Tertinggi",
                  value: formatPercent(stats.maxConfidence),
                },
                {
                  label: "Terendah",
                  value: formatPercent(stats.minConfidence),
                },
                {
                  label: "Rata-rata",
                  value: formatPercent(stats.avgConfidence),
                },
              ]}
            />
            <Divider />
          </>
        )}
        {visibility.includes("efficiency") && (
          <>
            <DetailSection
              title="Kinerja Efisiensi"
              data={[
                { label: "Tercepat", value: formatDuration(stats.minDuration) },
                { label: "Terlama", value: formatDuration(stats.maxDuration) },
                {
                  label: "Rata-rata",
                  value: formatDuration(stats.avgDuration),
                },
              ]}
            />
            <Divider />
          </>
        )}
        <HStack spacing={2} color="gray.500" fontSize="xs">
          <Icon as={TimeIcon} />
          <Text>
            {item.timestamp.toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) {
        pageNumbers.push("...");
      }
      if (currentPage > 2) {
        pageNumbers.push(currentPage - 1);
      }
      if (currentPage !== 1 && currentPage !== totalPages) {
        pageNumbers.push(currentPage);
      }
      if (currentPage < totalPages - 1) {
        pageNumbers.push(currentPage + 1);
      }
      if (currentPage < totalPages - 2) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }
    return [...new Set(pageNumbers)];
  };
  const pageNumbers = getPageNumbers();
  return (
    <HStack spacing={2} justify="center" mt={4}>
      <IconButton
        icon={<ChevronLeftIcon />}
        aria-label="Halaman Sebelumnya"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        variant="ghost"
      />
      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <Text key={`ellipsis-${index}`} px={2} color="gray.500">
            ...
          </Text>
        ) : (
          <Button
            key={page}
            size="sm"
            variant={currentPage === page ? "solid" : "ghost"}
            colorScheme="teal"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ),
      )}
      <IconButton
        icon={<ChevronRightIcon />}
        aria-label="Halaman Berikutnya"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        variant="ghost"
      />
    </HStack>
  );
};

const HistoryControls = ({
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  visibility,
  onVisibilityChange,
  sortOptions,
  isExportingWord,
  onExportWord,
  isExportingTesisWord,
  onExportTesisWord,
  isExportingAll,
  onExportAllByType,
}) => (
  <Box p={4} bg="white" borderRadius="lg" shadow="sm" borderWidth={1}>
    <VStack align="stretch" spacing={4}>
      <HStack spacing={4} wrap="wrap">
        <InputGroup flex="1" minW={{ base: "100%", md: "250px" }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Cari judul atau model..."
            value={searchTerm}
            onChange={onSearchChange}
          />
        </InputGroup>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} minW="180px">
            Urutkan: {sortOption.label}
          </MenuButton>
          <MenuList>
            {sortOptions.map((opt) => (
              <MenuItem key={opt.value} onClick={() => onSortChange(opt)}>
                {opt.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <ButtonGroup isAttached variant="outline" size="md">
          <IconButton
            icon={<Icon as={BsFillGrid3X3GapFill} />}
            aria-label="Grid View"
            onClick={() => onViewModeChange("grid")}
            colorScheme={viewMode === "grid" ? "teal" : "gray"}
            variant={viewMode === "grid" ? "solid" : "outline"}
          />
          <IconButton
            icon={<Icon as={BsTable} />}
            aria-label="Table View"
            onClick={() => onViewModeChange("table")}
            colorScheme={viewMode === "table" ? "teal" : "gray"}
            variant={viewMode === "table" ? "solid" : "outline"}
          />
        </ButtonGroup>
        <ButtonGroup size="md" variant="outline">
          {viewMode === "table" && (
            <>
              <Button
                leftIcon={<Icon as={FaFileWord} />}
                colorScheme="blue"
                onClick={onExportWord}
                isLoading={isExportingWord}
              >
                Export to Word
              </Button>
              <Button
                leftIcon={<Icon as={FaFileWord} />}
                colorScheme="green"
                onClick={onExportTesisWord}
                isLoading={isExportingTesisWord}
              >
                Export (Tesis)
              </Button>
            </>
          )}
          <Menu>
            <MenuButton
              as={Button}
              leftIcon={<Icon as={FaFileArchive} />}
              rightIcon={<ChevronDownIcon />}
              colorScheme="purple"
              isLoading={isExportingAll}
            >
              Export All
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => onExportAllByType("docx")}>
                Word (.docx)
              </MenuItem>
              <MenuItem onClick={() => onExportAllByType("pdf")}>
                PDF (.pdf)
              </MenuItem>
              <MenuItem onClick={() => onExportAllByType("txt")}>
                Teks (.txt)
              </MenuItem>
              <MenuItem onClick={() => onExportAllByType("csv")}>
                CSV (.csv)
              </MenuItem>
              <MenuItem onClick={() => onExportAllByType("xlsx")}>
                Excel (.xlsx)
              </MenuItem>
              <MenuItem onClick={() => onExportAllByType("json")}>
                JSON (.json)
              </MenuItem>
            </MenuList>
          </Menu>
        </ButtonGroup>
      </HStack>
      <CheckboxGroup
        colorScheme="teal"
        value={visibility}
        onChange={onVisibilityChange}
      >
        <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={2}>
          Tampilkan Data:
        </Text>
        <Stack direction={{ base: "column", sm: "row" }} spacing={[2, 5]}>
          <Checkbox value="total">Total Soal</Checkbox>
          <Checkbox value="confidence">Kinerja Kepercayaan</Checkbox>
          <Checkbox value="efficiency">Kinerja Efisiensi</Checkbox>
        </Stack>
      </CheckboxGroup>
    </VStack>
  </Box>
);

const AnalysisCharts = ({
  aggregatedChartData,
  bestPerformers,
  allModels,
  selectedModelsForChart,
  onSelectedModelsChange,
  filterType,
  onFilterTypeChange,
  filterDifficulty,
  onFilterDifficultyChange,
  chartSortOption,
  onChartSortChange,
  questionTypeOptions,
  difficultyOptions,
  chartSortOptions,
}) => {
  const barChartRef = useRef(null);
  const confidenceChartRef = useRef(null);
  const durationChartRef = useRef(null);

  const barChartData = useMemo(() => {
    const dataForChart = aggregatedChartData.filter((item) =>
      selectedModelsForChart.has(item.model),
    );
    const labels = dataForChart.map((d) => d.model);
    const defaultConfidenceBg = "rgba(157, 192, 249, 0.6)";
    const highlightConfidenceBg = "rgba(49, 130, 206, 1)";
    const defaultDurationBg = "rgba(254, 235, 166, 0.6)";
    const highlightDurationBg = "rgba(214, 158, 46, 1)";
    return {
      labels,
      datasets: [
        {
          label: "Average Confidence",
          data: dataForChart.map((d) => d.avgConfidence),
          backgroundColor: dataForChart.map((d) =>
            d.model === bestPerformers.bestConfidenceModel
              ? highlightConfidenceBg
              : defaultConfidenceBg,
          ),
          borderColor: dataForChart.map((d) =>
            d.model === bestPerformers.bestConfidenceModel
              ? highlightConfidenceBg
              : defaultConfidenceBg.replace("0.6", "1"),
          ),
          borderWidth: 1,
          yAxisID: "y",
        },
        {
          label: "Average Duration (s)",
          data: dataForChart.map((d) => d.avgDuration),
          backgroundColor: dataForChart.map((d) =>
            d.model === bestPerformers.bestDurationModel
              ? highlightDurationBg
              : defaultDurationBg,
          ),
          borderColor: dataForChart.map((d) =>
            d.model === bestPerformers.bestDurationModel
              ? highlightDurationBg
              : defaultDurationBg.replace("0.6", "1"),
          ),
          borderWidth: 1,
          yAxisID: "y1",
        },
      ],
    };
  }, [aggregatedChartData, bestPerformers, selectedModelsForChart]);

  const barChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      datalabels: { display: false },
      title: { display: false },
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (c) =>
            `${c.dataset.label || ""}: ${
              c.dataset.yAxisID === "y"
                ? formatPercent(c.raw)
                : formatDuration(c.raw)
            }`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false,
          font: { size: 10 },
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: { display: true, text: "Confidence (%)" },
        ticks: { callback: (v) => formatPercent(v) },
        suggestedMin: 0,
        suggestedMax: 1,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: { display: true, text: "Duration (s)" },
        grid: { drawOnChartArea: false },
        ticks: { callback: (v) => `${v.toFixed(1)}s` },
        suggestedMin: 0,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: { boxWidth: 20, padding: 15 },
      },
      tooltip: {
        callbacks: {
          label: (c) =>
            `${c.label || ""}: ${
              c.dataset.label.includes("Confidence")
                ? formatPercent(c.raw)
                : formatDuration(c.raw)
            }`,
        },
      },
      datalabels: {
        display: true,
        color: "#fff",
        font: {
          weight: "bold",
          size: 10,
        },
        formatter: (v, c) =>
          c.dataset.label.includes("Confidence")
            ? formatPercent(v)
            : formatDuration(v),
      },
    },
  };

  const confidenceChartData = useMemo(() => {
    const dataForChart = aggregatedChartData.filter((item) =>
      selectedModelsForChart.has(item.model),
    );
    return {
      labels: dataForChart.map((d) => d.model),
      datasets: [
        {
          label: "Average Confidence",
          data: dataForChart.map((d) => d.avgConfidence),
          backgroundColor: dataForChart.map(
            (_, i) => CHART_COLORS[i % CHART_COLORS.length],
          ),
          borderColor: "#ffffff",
          borderWidth: 2,
          offset: dataForChart.map((d) =>
            d.model === bestPerformers.bestConfidenceModel ? 40 : 0,
          ),
        },
      ],
    };
  }, [aggregatedChartData, bestPerformers, selectedModelsForChart]);

  const durationChartData = useMemo(() => {
    const dataForChart = aggregatedChartData.filter((item) =>
      selectedModelsForChart.has(item.model),
    );
    return {
      labels: dataForChart.map((d) => d.model),
      datasets: [
        {
          label: "Average Duration",
          data: dataForChart.map((d) => d.avgDuration),
          backgroundColor: dataForChart.map(
            (_, i) => CHART_COLORS[i % CHART_COLORS.length],
          ),
          borderColor: "#ffffff",
          borderWidth: 2,
          offset: dataForChart.map((d) =>
            d.model === bestPerformers.bestDurationModel ? 40 : 0,
          ),
        },
      ],
    };
  }, [aggregatedChartData, bestPerformers, selectedModelsForChart]);

  const handleDownloadChart = (chartRef, filename) => {
    if (chartRef.current) {
      const link = document.createElement("a");
      link.href = chartRef.current.toBase64Image();
      link.download = filename;
      link.click();
    }
  };
  const handleExportCSV = () => {
    const dataToExport = aggregatedChartData.filter((item) =>
      selectedModelsForChart.has(item.model),
    );
    let csvContent =
      "data:text/csv;charset=utf-8,Model,Average Confidence,Average Duration (s)\n";
    dataToExport.forEach((row) => {
      csvContent += `${row.model},${row.avgConfidence},${row.avgDuration}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "model_performance_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <VStack spacing={8} align="stretch" mt={4}>
      <Box
        p={{ base: 4, md: 6 }}
        bg="white"
        borderRadius="lg"
        shadow="sm"
        borderWidth={1}
      >
        <VStack spacing={4} align="stretch">
          <Heading as="h2" size="md" color="gray.800">
            Analysis Filters & Options
          </Heading>
          <HStack spacing={4} wrap="wrap">
            <Menu>
              <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
                Filter Tipe Soal: {questionTypeOptions[filterType]}
              </MenuButton>
              <MenuList>
                {Object.entries(questionTypeOptions).map(([value, label]) => (
                  <MenuItem
                    key={value}
                    onClick={() => onFilterTypeChange(value)}
                  >
                    {label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
                Filter Tingkat Kesulitan: {difficultyOptions[filterDifficulty]}
              </MenuButton>
              <MenuList>
                {Object.entries(difficultyOptions).map(([value, label]) => (
                  <MenuItem
                    key={value}
                    onClick={() => onFilterDifficultyChange(value)}
                  >
                    {label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
                Urutkan Chart:{" "}
                {
                  chartSortOptions.find((o) => o.value === chartSortOption)
                    .label
                }
              </MenuButton>
              <MenuList>
                {chartSortOptions.map((opt) => (
                  <MenuItem
                    key={opt.value}
                    onClick={() => onChartSortChange(opt.value)}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>
          <Box w="full">
            <Text fontWeight="bold" mb={2} fontSize="sm" color="gray.600">
              Tampilkan Model:
            </Text>
            <CheckboxGroup
              colorScheme="teal"
              value={[...selectedModelsForChart]}
              onChange={(values) => onSelectedModelsChange(new Set(values))}
            >
              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={[2, 4]}
                wrap="wrap"
              >
                {allModels.map((model) => (
                  <Checkbox key={model} value={model}>
                    {model}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </Box>
        </VStack>
      </Box>
      <Box
        p={{ base: 4, md: 6 }}
        bg="white"
        borderRadius="lg"
        shadow="sm"
        borderWidth={1}
      >
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="center" wrap="wrap">
            <Heading as="h2" size="md" color="gray.800">
              Model Performance Comparison
            </Heading>
            <ButtonGroup size="sm" variant="outline">
              <Button
                leftIcon={<Icon as={FaDownload} />}
                onClick={() =>
                  handleDownloadChart(barChartRef, "model-performance-bar.png")
                }
              >
                Download Chart
              </Button>
              <Button
                leftIcon={<Icon as={FaDownload} />}
                onClick={handleExportCSV}
              >
                Export CSV
              </Button>
            </ButtonGroup>
          </HStack>
          <Box h={{ base: "400px", md: "500px" }} w="full">
            <Bar
              ref={barChartRef}
              options={barChartOptions}
              data={barChartData}
            />
          </Box>
          <VStack
            align="stretch"
            spacing={2}
            p={4}
            bg="gray.50"
            borderRadius="md"
          >
            <HStack>
              <Icon as={FaTrophy} color="blue.500" />
              <Text fontSize="sm">
                <Text as="span" fontWeight="bold">
                  Best Confidence:
                </Text>{" "}
                {bestPerformers.bestConfidenceModel || "N/A"}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaBolt} color="yellow.500" />
              <Text fontSize="sm">
                <Text as="span" fontWeight="bold">
                  Fastest Duration:
                </Text>{" "}
                {bestPerformers.bestDurationModel || "N/A"}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Box>
      <Box
        p={{ base: 4, md: 6 }}
        bg="white"
        borderRadius="lg"
        shadow="sm"
        borderWidth={1}
      >
        <VStack spacing={6} align="stretch">
          <Heading as="h2" size="md" color="gray.800">
            Proportional Performance Analysis
          </Heading>
          <Grid
            templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
            gap={{ base: 8, lg: 6 }}
          >
            <GridItem>
              <VStack spacing={4}>
                <HStack w="full" justify="space-between">
                  <Heading size="sm">Confidence</Heading>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    icon={<Icon as={FaDownload} />}
                    onClick={() =>
                      handleDownloadChart(
                        confidenceChartRef,
                        "confidence-performance.png",
                      )
                    }
                    aria-label="Download Confidence Chart"
                  />
                </HStack>
                <Box w="full" h="auto">
                  <Doughnut
                    ref={confidenceChartRef}
                    options={doughnutOptions}
                    data={confidenceChartData}
                  />
                </Box>
              </VStack>
            </GridItem>
            <GridItem>
              <VStack spacing={4}>
                <HStack w="full" justify="space-between">
                  <Heading size="sm">Duration</Heading>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    icon={<Icon as={FaDownload} />}
                    onClick={() =>
                      handleDownloadChart(
                        durationChartRef,
                        "duration-performance.png",
                      )
                    }
                    aria-label="Download Duration Chart"
                  />
                </HStack>
                <Box w="full" h="auto">
                  <Doughnut
                    ref={durationChartRef}
                    options={doughnutOptions}
                    data={durationChartData}
                  />
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Box>
    </VStack>
  );
};

function RiwayatPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [detailedHistoryData, setDetailedHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const cancelRef = useRef();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState({
    value: "timestamp",
    label: "Tanggal Terbaru",
    order: "desc",
  });
  const [visibility, setVisibility] = useState([
    "total",
    "confidence",
    "efficiency",
  ]);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedItems, setSelectedItems] = useState(new Set());

  const [filterType, setFilterType] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [chartSortOption, setChartSortOption] = useState("model_asc");
  const [selectedModelsForChart, setSelectedModelsForChart] = useState(
    new Set(),
  );

  const {
    isOpen: isLeftDrawerOpen,
    onOpen: onLeftDrawerOpen,
    onClose: onLeftDrawerClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose,
  } = useDisclosure();
  const {
    isOpen: isBulkDeleteAlertOpen,
    onOpen: onBulkDeleteAlertOpen,
    onClose: onBulkDeleteAlertClose,
  } = useDisclosure();

  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isExportingTesisWord, setIsExportingTesisWord] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);

  const sortOptions = [
    { value: "timestamp", label: "Tanggal Terbaru", order: "desc" },
    { value: "title", label: "Judul (A-Z)", order: "asc" },
    { value: "totalQuestions", label: "Jumlah Soal", order: "desc" },
    { value: "avgConfidence", label: "Kepercayaan", order: "desc" },
  ];
  const chartSortOptions = [
    { value: "model_asc", label: "Nama Model (A-Z)" },
    { value: "confidence_desc", label: "Kepercayaan Terbaik" },
    { value: "duration_asc", label: "Durasi Tercepat" },
  ];
  const questionTypeOptions = {
    all: "Semua Tipe",
    "multiple-choice": "Pilihan Ganda",
    essay: "Esai",
    "true-false": "Benar/Salah",
    "fill-in-the-blank": "Isian",
  };
  const difficultyOptions = {
    all: "Semua Tingkat",
    lots: "Dasar (LOTS)",
    mots: "Menengah (MOTS)",
    hots: "Tingkat Lanjut (HOTS)",
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/sessions");
        setDetailedHistoryData(response.data);
      } catch (error) {
        console.error("Failed to fetch history stats:", error);
        toast({
          title: "Gagal memuat riwayat",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [toast]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption, viewMode]);

  const historyDataForDisplay = useMemo(() => {
    if (!detailedHistoryData) return [];
    return detailedHistoryData.map((session) => {
      // Flatten questions from all logs for statistical calculation
      const allQuestions = (session.logs || []).flatMap((log) =>
        log.questions.map((q) => ({
          ...q,
          // Ensure ai_duration from the log is attached to each question
          ai_duration: q.ai_duration || log.duration,
        })),
      );

      const stats = {
        totalQuestions: allQuestions.length,
        multipleChoiceCount: 0,
        essayCount: 0,
        trueFalseCount: 0,
        fillInTheBlankCount: 0,
        confidences: [],
        durations: [],
      };

      allQuestions.forEach((q) => {
        if (q.type === "multiple-choice") stats.multipleChoiceCount++;
        if (q.type === "essay") stats.essayCount++;
        if (q.type === "true-false") stats.trueFalseCount++;
        if (q.type === "fill-in-the-blank") stats.fillInTheBlankCount++;
        if (q.confidence) stats.confidences.push(parseFloat(q.confidence));
        if (q.ai_duration) stats.durations.push(parseFloat(q.ai_duration));
      });

      const avgConfidence =
        stats.confidences.length > 0
          ? stats.confidences.reduce((a, b) => a + b, 0) /
            stats.confidences.length
          : null;
      const avgDuration =
        stats.durations.length > 0
          ? stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length
          : null;

      return {
        ...session, // This now includes the original 'logs' array
        timestamp: new Date(session.created_at),
        totalQuestions: stats.totalQuestions,
        multipleChoiceCount: stats.multipleChoiceCount,
        essayCount: stats.essayCount,
        trueFalseCount: stats.trueFalseCount,
        fillInTheBlankCount: stats.fillInTheBlankCount,
        maxConfidence:
          stats.confidences.length > 0 ? Math.max(...stats.confidences) : null,
        minConfidence:
          stats.confidences.length > 0 ? Math.min(...stats.confidences) : null,
        avgConfidence,
        maxDuration:
          stats.durations.length > 0 ? Math.max(...stats.durations) : null,
        minDuration:
          stats.durations.length > 0 ? Math.min(...stats.durations) : null,
        avgDuration,
      };
    });
  }, [detailedHistoryData]);

  const filteredAndSortedHistory = useMemo(() => {
    return historyDataForDisplay
      .filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.model.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        const { value, order } = sortOption;
        const valA = a[value] === null ? -Infinity : a[value];
        const valB = b[value] === null ? -Infinity : b[value];
        if (order === "asc") return valA > valB ? 1 : -1;
        return valB > valA ? 1 : -1;
      });
  }, [historyDataForDisplay, searchTerm, sortOption]);

  const totalPages = Math.ceil(
    filteredAndSortedHistory.length / ITEMS_PER_PAGE,
  );
  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedHistory.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [currentPage, filteredAndSortedHistory]);

  useEffect(() => {
    setSelectedItems(new Set());
  }, [currentPage, viewMode, searchTerm, sortOption]);

  const allModels = useMemo(
    () => [...new Set(detailedHistoryData.map((item) => item.model))],
    [detailedHistoryData],
  );
  useEffect(() => {
    setSelectedModelsForChart(new Set(allModels));
  }, [allModels]);

  const aggregatedChartData = useMemo(() => {
    if (detailedHistoryData.length === 0) return [];
    const modelStats = {};
    detailedHistoryData.forEach((session) => {
      if (!modelStats[session.model]) {
        modelStats[session.model] = { confidences: [], durations: [] };
      }

      // FIX: Flatten questions from the nested 'logs' array before filtering
      const allQuestions = (session.logs || []).flatMap((log) =>
        log.questions.map((q) => ({
          ...q,
          ai_duration: q.ai_duration || log.duration,
        })),
      );

      const filteredQuestions = allQuestions.filter(
        (q) =>
          (filterType === "all" || q.type === filterType) &&
          (filterDifficulty === "all" || q.difficulty === filterDifficulty),
      );

      filteredQuestions.forEach((q) => {
        if (q.confidence)
          modelStats[session.model].confidences.push(parseFloat(q.confidence));
        if (q.ai_duration)
          modelStats[session.model].durations.push(parseFloat(q.ai_duration));
      });
    });

    const finalData = Object.entries(modelStats).map(([model, stats]) => {
      const avgConfidence =
        stats.confidences.length > 0
          ? stats.confidences.reduce((a, b) => a + b, 0) /
            stats.confidences.length
          : 0;
      const avgDuration =
        stats.durations.length > 0
          ? stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length
          : 0;
      return { model, avgConfidence, avgDuration };
    });

    return finalData.sort((a, b) => {
      switch (chartSortOption) {
        case "confidence_desc":
          return b.avgConfidence - a.avgConfidence;
        case "duration_asc":
          return a.avgDuration - b.avgDuration;
        case "model_asc":
        default:
          return a.model.localeCompare(b.model);
      }
    });
  }, [detailedHistoryData, filterType, filterDifficulty, chartSortOption]);

  const bestPerformers = useMemo(() => {
    const dataForPerf = aggregatedChartData.filter((item) =>
      selectedModelsForChart.has(item.model),
    );
    if (dataForPerf.length === 0)
      return { bestConfidenceModel: null, bestDurationModel: null };
    let maxConfidence = -1,
      bestConfidenceModel = null,
      minDuration = Infinity,
      bestDurationModel = null;
    dataForPerf.forEach((d) => {
      if (d.avgConfidence > maxConfidence) {
        maxConfidence = d.avgConfidence;
        bestConfidenceModel = d.model;
      }
      if (d.avgDuration < minDuration && d.avgDuration > 0) {
        minDuration = d.avgDuration;
        bestDurationModel = d.model;
      }
    });
    return { bestConfidenceModel, bestDurationModel };
  }, [aggregatedChartData, selectedModelsForChart]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 700);
  };

  const handleExportToWord = () => {
    setIsExportingWord(true);
    try {
      const createCell = (text, isHeader = false) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: String(text), bold: isHeader, size: 18 }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
        });

      const headerRow1Cells = [createCell("Title", true)];
      if (visibility.includes("total"))
        headerRow1Cells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Total Questions",
                    bold: true,
                    size: 18,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            columnSpan: 5,
          }),
        );
      if (visibility.includes("confidence"))
        headerRow1Cells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Confidence Performance",
                    bold: true,
                    size: 18,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            columnSpan: 3,
          }),
        );
      if (visibility.includes("efficiency"))
        headerRow1Cells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Efficiency Performance",
                    bold: true,
                    size: 18,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            columnSpan: 3,
          }),
        );
      headerRow1Cells.push(createCell("Date", true));

      const headerRow2Cells = [new TableCell({ children: [] })];
      if (visibility.includes("total")) {
        ["Total", "MCQ", "Essay", "T/F", "Fill-in"].forEach((text) =>
          headerRow2Cells.push(createCell(text, true)),
        );
      }
      if (visibility.includes("confidence")) {
        ["Highest", "Lowest", "Average"].forEach((text) =>
          headerRow2Cells.push(createCell(text, true)),
        );
      }
      if (visibility.includes("efficiency")) {
        ["Fastest", "Slowest", "Average"].forEach((text) =>
          headerRow2Cells.push(createCell(text, true)),
        );
      }
      headerRow2Cells.push(new TableCell({ children: [] }));

      const tableRows = filteredAndSortedHistory.map((item) => {
        const cells = [
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: item.title, size: 18 })],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: item.model, size: 14, color: "555555" }),
                ],
              }),
            ],
          }),
        ];
        if (visibility.includes("total")) {
          [
            item.totalQuestions,
            item.multipleChoiceCount,
            item.essayCount,
            item.trueFalseCount,
            item.fillInTheBlankCount,
          ].forEach((text) => cells.push(createCell(text)));
        }
        if (visibility.includes("confidence")) {
          [
            formatPercent(item.maxConfidence),
            formatPercent(item.minConfidence),
            formatPercent(item.avgConfidence),
          ].forEach((text) => cells.push(createCell(text)));
        }
        if (visibility.includes("efficiency")) {
          [
            formatDuration(item.minDuration),
            formatDuration(item.maxDuration),
            formatDuration(item.avgDuration),
          ].forEach((text) => cells.push(createCell(text)));
        }
        cells.push(createCell(item.timestamp.toLocaleDateString("en-US")));
        return new TableRow({ children: cells });
      });

      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: "Question Generation History",
                heading: "Heading1",
              }),
              new DocxTable({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: headerRow1Cells,
                    tableHeader: true,
                  }),
                  new TableRow({
                    children: headerRow2Cells,
                    tableHeader: true,
                  }),
                  ...tableRows,
                ],
              }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "generation-history.docx");
        toast({
          title: "Successfully exported to Word",
          status: "success",
        });
      });
    } catch (error) {
      console.error("Failed to export to Word:", error);
      toast({ title: "Failed to export to Word", status: "error" });
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleExportTesisToWord = () => {
    setIsExportingTesisWord(true);
    try {
      const aggregatedByModel = {};

      filteredAndSortedHistory.forEach((session) => {
        if (!aggregatedByModel[session.model]) {
          aggregatedByModel[session.model] = {
            allConfidences: [],
            allDurations: [],
          };
        }
        (session.logs || []).forEach((log) => {
          log.questions.forEach((q) => {
            if (q.confidence) {
              aggregatedByModel[session.model].allConfidences.push(
                parseFloat(q.confidence),
              );
            }
            if (log.duration) {
              aggregatedByModel[session.model].allDurations.push(
                parseFloat(log.duration),
              );
            }
          });
        });
      });

      const finalAggregatedData = Object.entries(aggregatedByModel).map(
        ([model, data]) => {
          const { allConfidences, allDurations } = data;
          const avgConfidence =
            allConfidences.length > 0
              ? allConfidences.reduce((a, b) => a + b, 0) /
                allConfidences.length
              : null;
          const avgDuration =
            allDurations.length > 0
              ? allDurations.reduce((a, b) => a + b, 0) / allDurations.length
              : null;
          return {
            model,
            maxConfidence:
              allConfidences.length > 0 ? Math.max(...allConfidences) : null,
            minConfidence:
              allConfidences.length > 0 ? Math.min(...allConfidences) : null,
            avgConfidence,
            maxDuration:
              allDurations.length > 0 ? Math.max(...allDurations) : null,
            minDuration:
              allDurations.length > 0 ? Math.min(...allDurations) : null,
            avgDuration,
          };
        },
      );

      const createCell = (text, isHeader = false) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: String(text), bold: isHeader, size: 18 }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
        });

      const headerRow1Cells = [
        createCell("Model", true),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Confidence Performance",
                  bold: true,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          columnSpan: 3,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Efficiency Performance",
                  bold: true,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          columnSpan: 3,
        }),
      ];

      const headerRow2Cells = [
        new TableCell({ children: [] }),
        createCell("Highest", true),
        createCell("Lowest", true),
        createCell("Average", true),
        createCell("Fastest", true),
        createCell("Slowest", true),
        createCell("Average", true),
      ];

      const tableRows = finalAggregatedData.map((item) => {
        const cells = [
          createCell(item.model),
          createCell(formatPercent(item.maxConfidence)),
          createCell(formatPercent(item.minConfidence)),
          createCell(formatPercent(item.avgConfidence)),
          createCell(formatDuration(item.minDuration)),
          createCell(formatDuration(item.maxDuration)),
          createCell(formatDuration(item.avgDuration)),
        ];
        return new TableRow({ children: cells });
      });

      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: "Question Generation History (Tesis version)",
                heading: "Heading1",
              }),
              new DocxTable({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: headerRow1Cells,
                    tableHeader: true,
                  }),
                  new TableRow({
                    children: headerRow2Cells,
                    tableHeader: true,
                  }),
                  ...tableRows,
                ],
              }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "generation-history-tesis-version.docx");
        toast({
          title: "Successfully exported Tesis version to Word",
          status: "success",
        });
      });
    } catch (error) {
      console.error("Failed to export Tesis version to Word:", error);
      toast({
        title: "Failed to export Tesis version to Word",
        status: "error",
      });
    } finally {
      setIsExportingTesisWord(false);
    }
  };

  const handleExportAllByType = async (format) => {
    if (historyDataForDisplay.length === 0) {
      toast({ title: "Tidak ada riwayat untuk diekspor.", status: "warning" });
      return;
    }
    setIsExportingAll(true);
    const toastId = toast({
      title: `Memulai ekspor ke .${format.toUpperCase()}...`,
      description: "Ini mungkin akan memakan waktu.",
      status: "info",
      duration: null,
      isClosable: false,
    });

    try {
      await exportAllSessionsToZipByType(historyDataForDisplay, format);
      toast.update(toastId, {
        title: "Ekspor Berhasil!",
        description: "Silakan periksa folder unduhan Anda.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(`Gagal mengekspor semua sesi ke zip (${format}):`, error);
      toast.update(toastId, {
        title: "Ekspor Gagal",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsExportingAll(false);
    }
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    onDeleteAlertOpen();
  };
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/sessions/${itemToDelete}`);
      setDetailedHistoryData((prev) =>
        prev.filter((item) => item.id !== itemToDelete),
      );
      toast({ title: "Riwayat berhasil dihapus", status: "success" });
    } catch (error) {
      toast({ title: "Gagal menghapus riwayat", status: "error" });
    } finally {
      setIsDeleting(false);
      onDeleteAlertClose();
      setItemToDelete(null);
    }
  };
  const confirmBulkDelete = async () => {
    setIsDeleting(true);
    const promises = Array.from(selectedItems).map((id) =>
      api.delete(`/sessions/${id}`),
    );
    const results = await Promise.allSettled(promises);
    const failedCount = results.filter((r) => r.status === "rejected").length;
    if (failedCount > 0)
      toast({ title: `Gagal menghapus ${failedCount} item.`, status: "error" });
    else
      toast({
        title: "Semua item terpilih berhasil dihapus",
        status: "success",
      });
    setDetailedHistoryData((prev) =>
      prev.filter((item) => !selectedItems.has(item.id)),
    );
    setSelectedItems(new Set());
    setIsDeleting(false);
    onBulkDeleteAlertClose();
  };
  const handleEditClick = (item) => {
    setEditingItemId(item.id);
    setNewTitle(item.title);
  };
  const handleCancelEdit = () => {
    setEditingItemId(null);
    setNewTitle("");
  };
  const handleSaveTitle = async (id) => {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      toast({ title: "Judul tidak boleh kosong", status: "warning" });
      return;
    }
    setIsSavingEdit(true);
    try {
      await api.put(`/sessions/${id}/title`, { title: trimmedTitle });
      setDetailedHistoryData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, title: trimmedTitle } : item,
        ),
      );
      toast({ title: "Judul berhasil diperbarui", status: "success" });
      handleCancelEdit();
    } catch (error) {
      toast({ title: "Gagal memperbarui judul", status: "error" });
    } finally {
      setIsSavingEdit(false);
    }
  };
  const handleSelectItem = (id) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };
  const handleSelectAllOnPage = (e) => {
    if (e.target.checked)
      setSelectedItems(new Set(paginatedHistory.map((item) => item.id)));
    else setSelectedItems(new Set());
  };
  const isAllOnPageSelected =
    paginatedHistory.length > 0 &&
    selectedItems.size === paginatedHistory.length &&
    paginatedHistory.every((item) => selectedItems.has(item.id));
  const gridTemplateColumns = {
    base: "1fr",
    lg: `${isLeftSidebarCollapsed ? "0px" : "220px"} 1fr`,
  };

  return (
    <>
      {isLoggingOut && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="whiteAlpha.800"
          align="center"
          justify="center"
          zIndex="tooltip"
        >
          <Spinner size="xl" />
        </Flex>
      )}
      <Grid
        templateColumns={gridTemplateColumns}
        h="100vh"
        w="100vw"
        overflow="hidden"
        transition="grid-template-columns 0.3s ease-in-out"
      >
        <GridItem
          as="aside"
          p={isLeftSidebarCollapsed ? 0 : 5}
          borderRight="1px solid"
          borderColor="gray.200"
          display={{ base: "none", lg: "block" }}
          overflow="hidden"
          whiteSpace="nowrap"
        >
          <Box
            visibility={isLeftSidebarCollapsed ? "hidden" : "visible"}
            opacity={isLeftSidebarCollapsed ? 0 : 1}
            transition="opacity 0.2s"
          >
            <LeftSidebarContent
              user={user}
              onLogoutClick={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </Box>
        </GridItem>
        <GridItem as="main" position="relative" overflowX="hidden">
          <Flex direction="column" h="100%" bg="gray.50">
            <Flex
              justify="space-between"
              align="center"
              p={4}
              display={{ base: "flex", lg: "none" }}
              borderBottom="1px solid"
              borderColor="gray.200"
              bg="white"
            >
              <IconButton
                icon={<HamburgerIcon />}
                onClick={onLeftDrawerOpen}
                aria-label="Buka Menu"
                variant="ghost"
              />
              <Heading size="md" color="teal.700">
                Riwayat
              </Heading>
              <Box w="40px" />
            </Flex>
            <Flex
              justify="space-between"
              align="center"
              p={3}
              px={4}
              bg="white"
              borderBottom="1px solid"
              borderColor="gray.200"
              position="sticky"
              top="0"
              zIndex="1"
            >
              <HStack>
                <IconButton
                  display={{ base: "none", lg: "inline-flex" }}
                  icon={
                    isLeftSidebarCollapsed ? (
                      <ChevronRightIcon />
                    ) : (
                      <ChevronLeftIcon />
                    )
                  }
                  onClick={() =>
                    setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)
                  }
                  aria-label="Toggle Sidebar Kiri"
                  size="sm"
                  variant="ghost"
                />
                <Heading size="sm" color="gray.700">
                  Riwayat ({filteredAndSortedHistory.length})
                </Heading>
              </HStack>
            </Flex>
            <Box flex="1" p={{ base: 4, md: 6 }} overflowY="auto">
              <VStack spacing={6} align="stretch" mx="auto">
                <Box>
                  <Heading as="h1" size="lg" color="gray.800">
                    Riwayat Generasi Soal
                  </Heading>
                  <Text color="gray.600" mt={1}>
                    Lihat dan kelola semua sesi pembuatan soal yang pernah Anda
                    lakukan.
                  </Text>
                </Box>
                {!isLoading && detailedHistoryData.length > 0 && (
                  <VStack align="stretch" spacing={4}>
                    {selectedItems.size > 0 && (
                      <Flex
                        justify="space-between"
                        align="center"
                        p={3}
                        bg="teal.50"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="teal.200"
                      >
                        <Text fontSize="sm" color="teal.800" fontWeight="bold">
                          {selectedItems.size} terpilih
                        </Text>
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          leftIcon={<DeleteIcon />}
                          onClick={onBulkDeleteAlertOpen}
                        >
                          Hapus
                        </Button>
                      </Flex>
                    )}
                    <HistoryControls
                      searchTerm={searchTerm}
                      onSearchChange={(e) => setSearchTerm(e.target.value)}
                      sortOption={sortOption}
                      onSortChange={setSortOption}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                      visibility={visibility}
                      onVisibilityChange={setVisibility}
                      sortOptions={sortOptions}
                      isExportingWord={isExportingWord}
                      onExportWord={handleExportToWord}
                      isExportingTesisWord={isExportingTesisWord}
                      onExportTesisWord={handleExportTesisToWord}
                      isExportingAll={isExportingAll}
                      onExportAllByType={handleExportAllByType}
                    />
                  </VStack>
                )}
                <Box>
                  {isLoading ? (
                    <Flex justify="center" align="center" h="50vh">
                      <Spinner size="xl" />
                    </Flex>
                  ) : paginatedHistory.length > 0 ? (
                    <>
                      {viewMode === "grid" ? (
                        <Grid
                          templateColumns="repeat(auto-fill, minmax(320px, 1fr))"
                          gap={4}
                        >
                          {paginatedHistory.map((item) => (
                            <HistoryItemCard
                              key={item.id}
                              item={item}
                              isEditing={editingItemId === item.id}
                              newTitle={newTitle}
                              isSaving={isSavingEdit}
                              isSelected={selectedItems.has(item.id)}
                              onDeleteClick={handleDeleteClick}
                              onEditClick={handleEditClick}
                              onCancelClick={handleCancelEdit}
                              onSaveClick={handleSaveTitle}
                              onTitleChange={(e) => setNewTitle(e.target.value)}
                              onSelect={handleSelectItem}
                              visibility={visibility}
                            />
                          ))}
                        </Grid>
                      ) : (
                        <TableContainer
                          bg="white"
                          borderRadius="lg"
                          borderWidth={1}
                          borderColor="gray.200"
                        >
                          <Table variant="simple" size="sm">
                            <Thead
                              position="sticky"
                              top={0}
                              zIndex={1}
                              bg="gray.50"
                            >
                              <Tr>
                                <Th
                                  w="50px"
                                  rowSpan={2}
                                  position="sticky"
                                  left={0}
                                  zIndex={1}
                                  bg="gray.50"
                                >
                                  <Checkbox
                                    isChecked={isAllOnPageSelected}
                                    onChange={handleSelectAllOnPage}
                                    colorScheme="teal"
                                  />
                                </Th>
                                <Th
                                  rowSpan={2}
                                  position="sticky"
                                  left="50px"
                                  zIndex={1}
                                  bg="gray.50"
                                  shadow="sm"
                                >
                                  Judul
                                </Th>
                                {visibility.includes("total") && (
                                  <Th colSpan={5} textAlign="center">
                                    Total Soal
                                  </Th>
                                )}
                                {visibility.includes("confidence") && (
                                  <Th colSpan={3} textAlign="center">
                                    Kinerja Kepercayaan
                                  </Th>
                                )}
                                {visibility.includes("efficiency") && (
                                  <Th colSpan={3} textAlign="center">
                                    Kinerja Efisiensi
                                  </Th>
                                )}
                                <Th rowSpan={2}>Tanggal</Th>
                                <Th rowSpan={2}>Aksi</Th>
                              </Tr>
                              <Tr>
                                {visibility.includes("total") && (
                                  <>
                                    <Th isNumeric>Total</Th>
                                    <Th isNumeric>PG</Th>
                                    <Th isNumeric>Esai</Th>
                                    <Th isNumeric>B/S</Th>
                                    <Th isNumeric>Isian</Th>
                                  </>
                                )}
                                {visibility.includes("confidence") && (
                                  <>
                                    <Th isNumeric>Tertinggi</Th>
                                    <Th isNumeric>Terendah</Th>
                                    <Th isNumeric>Rata-rata</Th>
                                  </>
                                )}
                                {visibility.includes("efficiency") && (
                                  <>
                                    <Th isNumeric>Tercepat</Th>
                                    <Th isNumeric>Terlama</Th>
                                    <Th isNumeric>Rata-rata</Th>
                                  </>
                                )}
                              </Tr>
                            </Thead>
                            <Tbody>
                              {paginatedHistory.map((item) => (
                                <Tr
                                  key={item.id}
                                  bg={
                                    selectedItems.has(item.id)
                                      ? "teal.50"
                                      : "inherit"
                                  }
                                >
                                  <Td
                                    position="sticky"
                                    left={0}
                                    bg={
                                      selectedItems.has(item.id)
                                        ? "teal.50"
                                        : "white"
                                    }
                                    zIndex={1}
                                  >
                                    <Checkbox
                                      isChecked={selectedItems.has(item.id)}
                                      onChange={() => handleSelectItem(item.id)}
                                      colorScheme="teal"
                                    />
                                  </Td>
                                  <Td
                                    position="sticky"
                                    left="50px"
                                    bg={
                                      selectedItems.has(item.id)
                                        ? "teal.50"
                                        : "white"
                                    }
                                    zIndex={1}
                                    shadow="sm"
                                    maxW="300px"
                                  >
                                    {editingItemId === item.id ? (
                                      <HStack spacing={2}>
                                        <Input
                                          value={newTitle}
                                          onChange={(e) =>
                                            setNewTitle(e.target.value)
                                          }
                                          size="sm"
                                          autoFocus
                                        />
                                        <IconButton
                                          icon={<CheckIcon />}
                                          size="sm"
                                          onClick={() =>
                                            handleSaveTitle(item.id)
                                          }
                                          isLoading={isSavingEdit}
                                        />
                                        <IconButton
                                          icon={<CloseIcon />}
                                          size="sm"
                                          onClick={handleCancelEdit}
                                        />
                                      </HStack>
                                    ) : (
                                      <Box>
                                        <RouterLink to={`/c/${item.id}`}>
                                          <Text
                                            noOfLines={1}
                                            title={item.title}
                                            fontWeight="medium"
                                          >
                                            {item.title}
                                          </Text>
                                        </RouterLink>
                                        <Code colorScheme="gray" fontSize="2xs">
                                          {item.model}
                                        </Code>
                                      </Box>
                                    )}
                                  </Td>
                                  {visibility.includes("total") && (
                                    <>
                                      <Td isNumeric fontWeight="bold">
                                        {item.totalQuestions}
                                      </Td>
                                      <Td isNumeric>
                                        {item.multipleChoiceCount}
                                      </Td>
                                      <Td isNumeric>{item.essayCount}</Td>
                                      <Td isNumeric>{item.trueFalseCount}</Td>
                                      <Td isNumeric>
                                        {item.fillInTheBlankCount}
                                      </Td>
                                    </>
                                  )}
                                  {visibility.includes("confidence") && (
                                    <>
                                      <Td isNumeric>
                                        {formatPercent(item.maxConfidence)}
                                      </Td>
                                      <Td isNumeric>
                                        {formatPercent(item.minConfidence)}
                                      </Td>
                                      <Td isNumeric fontWeight="bold">
                                        {formatPercent(item.avgConfidence)}
                                      </Td>
                                    </>
                                  )}
                                  {visibility.includes("efficiency") && (
                                    <>
                                      <Td isNumeric>
                                        {formatDuration(item.minDuration)}
                                      </Td>
                                      <Td isNumeric>
                                        {formatDuration(item.maxDuration)}
                                      </Td>
                                      <Td isNumeric fontWeight="bold">
                                        {formatDuration(item.avgDuration)}
                                      </Td>
                                    </>
                                  )}
                                  <Td whiteSpace="nowrap">
                                    {item.timestamp.toLocaleDateString(
                                      "id-ID",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      },
                                    )}
                                  </Td>
                                  <Td>
                                    <HStack spacing={1}>
                                      <IconButton
                                        icon={<EditIcon />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEditClick(item)}
                                        isDisabled={editingItemId === item.id}
                                      />
                                      <IconButton
                                        icon={<DeleteIcon />}
                                        size="sm"
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() =>
                                          handleDeleteClick(item.id)
                                        }
                                      />
                                    </HStack>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      )}
                      {totalPages > 1 && (
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      )}
                    </>
                  ) : (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      h="50vh"
                      bg="white"
                      borderRadius="lg"
                      border="2px dashed"
                      borderColor="gray.200"
                    >
                      <Icon as={TimeIcon} boxSize="40px" color="gray.400" />
                      <Heading size="md" color="gray.600" mt={4}>
                        Belum Ada Riwayat
                      </Heading>
                      <Text color="gray.500" mt={1}>
                        {searchTerm
                          ? "Tidak ada riwayat yang cocok dengan pencarian Anda."
                          : "Mulai buat soal dan riwayat Anda akan muncul di sini."}
                      </Text>
                    </Flex>
                  )}
                </Box>
                {!isLoading && detailedHistoryData.length > 0 && (
                  <AnalysisCharts
                    aggregatedChartData={aggregatedChartData}
                    bestPerformers={bestPerformers}
                    allModels={allModels}
                    selectedModelsForChart={selectedModelsForChart}
                    onSelectedModelsChange={setSelectedModelsForChart}
                    filterType={filterType}
                    onFilterTypeChange={setFilterType}
                    filterDifficulty={filterDifficulty}
                    onFilterDifficultyChange={setFilterDifficulty}
                    chartSortOption={chartSortOption}
                    onChartSortChange={setChartSortOption}
                    questionTypeOptions={questionTypeOptions}
                    difficultyOptions={difficultyOptions}
                    chartSortOptions={chartSortOptions}
                  />
                )}
              </VStack>
            </Box>
          </Flex>
        </GridItem>
        <Drawer
          placement="left"
          onClose={onLeftDrawerClose}
          isOpen={isLeftDrawerOpen}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerBody mt={6}>
              <LeftSidebarContent
                user={user}
                onLogoutClick={handleLogout}
                isLoggingOut={isLoggingOut}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Grid>
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Riwayat Sesi
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah Anda yakin? Tindakan ini tidak dapat diurungkan.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                Batal
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDelete}
                ml={3}
                isLoading={isDeleting}
              >
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog
        isOpen={isBulkDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onBulkDeleteAlertClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus {selectedItems.size} Item Terpilih
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus semua sesi yang dipilih?
              Tindakan ini tidak dapat diurungkan.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onBulkDeleteAlertClose}>
                Batal
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmBulkDelete}
                ml={3}
                isLoading={isDeleting}
              >
                Hapus Semua
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default RiwayatPage;
