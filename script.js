const video = document.getElementById("video");
const statusBox = document.getElementById("status");

const API_BASE = " https://michal-challenging-misti.ngrok-free.dev";

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: false,
    });
    video.srcObject = stream;
  } catch (err) {
    alert("Không mở được camera: " + err.message);
  }
}

startCamera();

function start() {
  const code = document.getElementById("code").value.trim();
  if (!code) {
    alert("Nhập mã trước");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const image = canvas.toDataURL("image/jpeg", 0.7);

  fetch(`${API_BASE}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, image }),
  })
    .then((res) => res.json())
    .then((data) => {
      statusBox.innerText =
        data.status === "success"
          ? "✅ Điểm danh thành công - Cảm On Bạn Rất Nhiều"
          : "❌ " + data.message;
    })
    .catch((err) => {
      console.error(err);
      statusBox.innerText = "❌ Không kết nối được server - Bộ phận kĩ thuật chúng tôi hiện tại đã tắt server vui lòng liên hệ kĩ thuât để được giải quyết";
    });
}



