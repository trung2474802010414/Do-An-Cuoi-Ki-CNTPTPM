const API_KEY = "62d6c0d8e3f34f4783e152824262003";

const regions = {
    Bắc: ["Hanoi","Hai Phong","Ha Long","Bac Giang","Bac Ninh","Lang Son","Cao Bang","Ha Giang","Tuyen Quang","Lao Cai","Yen Bai","Thai Nguyen","Viet Tri","Vinh Yen","Hoa Binh","Son La","Dien Bien Phu","Lai Chau","Hai Duong","Hung Yen","Thai Binh","Nam Dinh","Ninh Binh"],
    Trung: ["Thanh Hoa","Vinh","Ha Tinh","Dong Hoi","Dong Ha","Hue","Da Nang","Tam Ky","Quang Ngai","Quy Nhon","Tuy Hoa","Nha Trang","Phan Rang-Thap Cham","Phan Thiet","Kon Tum","Pleiku","Buon Ma Thuot","Gia Nghia","Da Lat"],
    Nam: ["Ho Chi Minh City","Thu Dau Mot","Bien Hoa","Tay Ninh","Vung Tau","Tan An","My Tho","Ben Tre","Tra Vinh","Vinh Long","Cao Lanh","Long Xuyen","Rach Gia","Can Tho","Soc Trang","Bac Lieu","Ca Mau"]
};

const regionSelect = document.getElementById("region");
const citySelect = document.getElementById("city");
const inputCity = document.getElementById("searchCity");

//REGION → CITY 
regionSelect.addEventListener("change", function () {
    citySelect.innerHTML = '<option value="">-- Chọn tỉnh/thành --</option>';
    const region = this.value;

    if (!regions[region]) return;

    regions[region].forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
});

function getWeatherIcon(weather) {
    weather = weather.toLowerCase();
    if (weather.includes("clear")) return "☀️";
    if (weather.includes("cloud")) return "☁️";
    if (weather.includes("rain")) return "🌧";
    if (weather.includes("thunderstorm")) return "⛈";
    return "🌡";
}

function changeBackground(weather) {
    weather = weather.toLowerCase();
    let bg = "";

    if (weather.includes("clear")) {
        bg = "linear-gradient(135deg, #fceabb, #f8b500)";
    } else if (weather.includes("cloud")) {
        bg = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
    } else if (weather.includes("rain")) {
        bg = "linear-gradient(135deg, #4e54c8, #8f94fb)";
    } else {
        bg = "linear-gradient(135deg, #74ebd5, #9face6)";
    }

    document.body.style.background = bg;
}

async function getAddress(lat, lon) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=vi`;

        const res = await fetch(url);
        const data = await res.json();

      
        return data.display_name.split(",").slice(0, 3).join(",");

    } catch (err) {
        console.log(err);
        return "Không xác định";
    }
}

//  GET WEATHER 
async function getWeather(customCity = null, address = null) {

    const city = customCity || inputCity.value || citySelect.value;

    if (!city) {
        alert("Vui lòng nhập hoặc chọn thành phố");
        return;
    }

    document.getElementById("weather").innerHTML = "⏳ Đang tải...";

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=3&lang=vi`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            document.getElementById("weather").innerHTML = data.error.message;
            return;
        }

        localStorage.setItem("lastCity", city);

        const weatherDesc = data.current.condition.text;
        const icon = getWeatherIcon(weatherDesc);

        changeBackground(weatherDesc);

        //  FORECAST NGANG 
        let forecastHTML = `<div class="forecast">`;

        data.forecast.forecastday.forEach(day => {
            forecastHTML += `
                <div class="forecast-item">
                    <b>${day.date}</b>
                    <p>🌡 ${day.day.avgtemp_c}°C</p>
                    <p>${day.day.condition.text}</p>
                </div>
            `;
        });

        forecastHTML += `</div>`;

        document.getElementById("weather").innerHTML = `
            <h2>${data.location.name}</h2>
            <p style="color:#ff5722;">📍 ${address || data.location.name}</p>

            <p>🕒 ${data.location.localtime}</p>

            <h3>${icon} ${weatherDesc}</h3>

            <p>🌡 Nhiệt độ: ${data.current.temp_c} °C</p>
            <p>🥵 Cảm giác như: ${data.current.feelslike_c} °C</p>
            <p>💨 Gió: ${data.current.wind_kph} km/h</p>

            <p>💧 Độ ẩm: ${data.current.humidity}%</p>
            <div style="background:#ddd; border-radius:10px;">
                <div style="
                    width:${data.current.humidity}%;
                    background:#4CAF50;
                    padding:5px;
                    border-radius:10px;
                    color:white;
                ">
                    ${data.current.humidity}%
                </div>
            </div>

            <h3>📅 Dự báo 3 ngày</h3>
            ${forecastHTML}
        `;

    } catch (err) {
        console.log(err);
    }
}

// GPS 
function getLocationWeather() {
    navigator.geolocation.getCurrentPosition(async (pos) => {

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const address = await getAddress(lat, lon);

        getWeather(`${lat},${lon}`, address);
    });
}

//  AUTO LOAD 
window.onload = () => {
    const last = localStorage.getItem("lastCity");
    if (last) getWeather(last);
};

// CLOCK 
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");

    document.getElementById("clock").innerText = `🕒 ${h}:${m}:${s}`;
}

setInterval(updateClock, 1000);