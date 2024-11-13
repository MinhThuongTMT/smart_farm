// Mode selection functionality
const manualControl = document.getElementById("manualControl");
const timerSection = document.getElementById("timerSection");

document
  .getElementById("manualMode")
  .addEventListener("click", () => activateMode("manual"));
document
  .getElementById("automaticMode")
  .addEventListener("click", () => activateMode("automatic"));
document
  .getElementById("scheduleMode")
  .addEventListener("click", () => activateMode("schedule"));

function activateMode(mode) {
  document
    .querySelectorAll(".mode-button")
    .forEach((button) => button.classList.remove("active"));
  if (mode === "manual") {
    manualControl.style.display = "flex";
    timerSection.style.display = "none";
    document.getElementById("manualMode").classList.add("active");
  } else if (mode === "automatic") {
    manualControl.style.display = "none";
    timerSection.style.display = "none";
    document.getElementById("automaticMode").classList.add("active");
    // Add MQTT or API call for automatic mode logic here
  } else if (mode === "schedule") {
    manualControl.style.display = "none";
    timerSection.style.display = "block";
    document.getElementById("scheduleMode").classList.add("active");
    // Add MQTT or API call for schedule mode logic here
  }
}

// Cập nhật ngày giờ
function updateDateTime() {
  const now = new Date();

  // Mảng chứa các ngày trong tuần bằng tiếng Việt
  const daysOfWeek = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  const dayName = daysOfWeek[now.getDay()];

  // Định dạng ngày, tháng, năm, giờ, phút và giây
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, nên phải cộng thêm 1
  const year = now.getFullYear();

  // Lấy giờ, phút và giây
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Xác định AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12; // Chuyển đổi giờ sang định dạng 12 giờ
  hours = hours ? String(hours).padStart(2, "0") : "12"; // Nếu giờ là 0 thì là 12

  // Tạo chuỗi ngày và giờ theo định dạng yêu cầu
  const dateString = `Ngày: ${dayName}, ${day}/${month}/${year}`;
  const timeString = `Giờ: ${hours}:${minutes}:${seconds} ${ampm}`;

  // Cập nhật nội dung trong các phần tử
  document.getElementById("date").textContent = dateString;
  document.getElementById("time").textContent = timeString;
}

// Cập nhật ngày giờ mỗi giây
setInterval(updateDateTime, 1000);

// OFF - ON  function toggleDevice(device) {
function toggleDevice(device) {
  let switchElement, imageElement;

  // Xác định phần tử switch và hình ảnh dựa trên thiết bị
  if (device === "motor") {
    switchElement = document.getElementById("motorSwitch");
    imageElement = document.getElementById("motorImage");
  } else if (device === "fan") {
    switchElement = document.getElementById("fanSwitch");
    imageElement = document.getElementById("fanImage");
  } else if (device === "lamp") {
    switchElement = document.getElementById("lampSwitch");
    imageElement = document.getElementById("lampImage");
  }

  // Kiểm tra trạng thái của checkbox và cập nhật ảnh
  if (switchElement.checked) {
    // Nếu checkbox được chọn, đổi ảnh thành _on
    imageElement.src = "./img/" + device + "_on.png";
  } else {
    // Nếu checkbox không được chọn, đổi ảnh thành _off
    imageElement.src = "./img/" + device + "_off.png";
  }

  // Nếu cần gửi lệnh MQTT, bạn có thể thêm ở đây
  // ví dụ: sendMQTTCommand(device, switchElement.checked);
}

// Button Save
function saveSettings(button) {
  // Get the parent card of the button
  const card = button.closest(".timer-card");

  // Get the start and end time values from the inputs
  const startTimeInput = card.querySelector('input[type="time"]:nth-of-type(1)');
  const endTimeInput = card.querySelector('input[type="time"]:nth-of-type(2)');

  // Get the time values as strings
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  // Get the save message element
  const saveMessage = card.querySelector(".save-message");

  // Check if the start time or end time is empty
  if (!startTime || !endTime) {
    saveMessage.textContent = "Thời gian không được bỏ trống!";
    saveMessage.style.display = "block";
    saveMessage.style.color = "red";
  }
  // Check if the start time is earlier than the end time
  else if (startTime < endTime) {
    // If valid, display success message
    saveMessage.textContent = "Lưu thành công!";
    saveMessage.style.display = "block";
    saveMessage.style.color = "green";

    // You can also add logic here to store the times, e.g., save to a database or localStorage
  } else {
    // If the start time is not earlier than end time, display an error message
    saveMessage.textContent = "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!";
    saveMessage.style.display = "block";
    saveMessage.style.color = "red";
  }

  // Optionally clear the message after a few seconds
  setTimeout(() => {
    saveMessage.style.display = "none";
  }, 5000);
}

