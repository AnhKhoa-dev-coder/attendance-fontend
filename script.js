const video = document.getElementById("video");
const statusBox = document.getElementById("status");

const API_BASE = " https://michal-challenging-misti.ngrok-free.dev";
// IP máy tính

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
          ? "✅ Điểm danh thành công"
          : "❌ " + data.message;
    })
    .catch((err) => {
      console.error(err);
      statusBox.innerText =
        "❌ Không kết nối được server - Bộ phận kĩ thuật chúng tôi hiện tại đã tắt server liên hệ kĩ thuât --> ( Anh Khoa ) để được giải quyết";
    });
}
function checkAttendance() {
  const code = document.getElementById("searchCode").value.trim();
  const dateInput = document.getElementById("searchDate").value.trim();
  const resultBox = document.getElementById("searchResult");

  if (!code || !dateInput) {
    resultBox.innerText = "❗ Vui lòng nhập đủ mã và ngày";
    return;
  }

  const date = normalizeDate(dateInput);

  if (!date) {
    resultBox.innerText = "❌ Ngày không hợp lệ (vd: 1/1/2025)";
    return;
  }

  const API_BASE = "http://192.168.1.116:5000";

  fetch(`${API_BASE}/check?code=${code}&date=${date}`)
    .then((res) => res.json())
    .then((data) => {
      const img = document.getElementById("resultImage");

      if (data.status === "found") {
        resultBox.innerHTML = `
        ✅ <b>${data.name}</b><br>
        Lớp: ${data.class}<br>
        Ngày: ${data.date}<br>
        Giờ: ${data.time}
      `;
        img.src = API_BASE + data.image;
        img.style.display = "block";
      } else {
        resultBox.innerText = data.message;
        img.style.display = "none";
      }
    })
    .catch((err) => {
      console.error(err);
      resultBox.innerText = "❌ Không kết nối được server";
    });

  function normalizeDate(input) {
    input = input.replace(/-/g, "/"); // cho phép 1-1-2025
    const parts = input.split("/");

    if (parts.length !== 3) return null;

    let [day, month, year] = parts;

    if (year.length === 2) year = "20" + year;

    day = day.padStart(2, "0");
    month = month.padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
}
