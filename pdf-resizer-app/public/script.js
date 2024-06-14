async function resizePDF() {
  const fileInput = document.getElementById("pdf-file");
  if (fileInput.files.length === 0) {
    alert("Please select a PDF file");
    return;
  }

  const formData = new FormData();
  formData.append("pdf", fileInput.files[0]);

  const response = await fetch("/api/resize", {
    // エンドポイントを /api/resize に変更
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    alert("Failed to resize PDF");
    return;
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resized.pdf";
  a.click();
  URL.revokeObjectURL(url);
}
