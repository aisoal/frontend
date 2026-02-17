let materi = "http://localhost:7645/uploads";

if (
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost"
) {
  materi = "http://localhost:7645/uploads";
} else {
  materi = `${window.location.origin}/uploads`;
}

export default materi;
