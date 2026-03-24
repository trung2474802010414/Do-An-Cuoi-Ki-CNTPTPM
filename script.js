const API_KEY = "62d6c0d8e3f34f4783e152824262003";

//   DỮ LIỆU KHU VỰC - TỈNH

const regions = {   
    Bắc: [
        "Hanoi",           // Hà Nội
        "Hai Phong",       // Hải Phòng
        "Ha Long",         // Quảng Ninh
        "Bac Giang",       // Bắc Giang
        "Bac Ninh",        // Bắc Ninh
        "Lang Son",        // Lạng Sơn
        "Cao Bang",        // Cao Bằng
        "Ha Giang",        // Hà Giang
        "Tuyen Quang",     // Tuyên Quang
        "Lao Cai",         // Lào Cai
        "Yen Bai",         // Yên Bái
        "Thai Nguyen",     // Thái Nguyên
        "Viet Tri",        // Phú Thọ
        "Vinh Yen",        // Vĩnh Phúc
        "Hoa Binh",        // Hòa Bình
        "Son La",          // Sơn La
        "Dien Bien Phu",   // Điện Biên
        "Lai Chau",        // Lai Châu
        "Hai Duong",       // Hải Dương
        "Hung Yen",        // Hưng Yên
        "Thai Binh",       // Thái Bình
        "Nam Dinh",        // Nam Định
        "Ninh Binh"        // Ninh Bình
    ],

    Trung: [
        "Thanh Hoa",           // Thanh Hóa
        "Vinh",                // Nghệ An
        "Ha Tinh",             // Hà Tĩnh
        "Dong Hoi",            // Quảng Bình
        "Dong Ha",             // Quảng Trị
        "Hue",                 // Thừa Thiên Huế
        "Da Nang",             // Đà Nẵng
        "Tam Ky",              // Quảng Nam
        "Quang Ngai",          // Quảng Ngãi
        "Quy Nhon",            // Bình Định
        "Tuy Hoa",             // Phú Yên
        "Nha Trang",           // Khánh Hòa
        "Phan Rang-Thap Cham", // Ninh Thuận
        "Phan Thiet",          // Bình Thuận
        "Kon Tum",             // Kon Tum
        "Pleiku",              // Gia Lai
        "Buon Ma Thuot",       // Đắk Lắk
        "Gia Nghia",           // Đắk Nông
        "Da Lat"               // Lâm Đồng
    ],

    Nam: [
        "Ho Chi Minh City", // TP.HCM
        "Thu Dau Mot",      // Bình Dương
        "Bien Hoa",         // Đồng Nai
        "Tay Ninh",         // Tây Ninh
        "Vung Tau",         // Bà Rịa - Vũng Tàu
        "Tan An",           // Long An
        "My Tho",           // Tiền Giang
        "Ben Tre",          // Bến Tre
        "Tra Vinh",         // Trà Vinh
        "Vinh Long",        // Vĩnh Long
        "Cao Lanh",         // Đồng Tháp
        "Long Xuyen",       // An Giang
        "Rach Gia",         // Kiên Giang
        "Can Tho",          // Cần Thơ
        "Soc Trang",        // Sóc Trăng
        "Bac Lieu",         // Bạc Liêu
        "Ca Mau"            // Cà Mau
    ]
};





//   LẤY ELEMENT HTML

const regionSelect = document.getElementById("region");
const citySelect = document.getElementById("city");


//   CHỌN KHU VỰC → HIỆN TỈNH


regionSelect.addEventListener("change", function () {

    citySelect.innerHTML = '<option value="">-- Chọn tỉnh/thành --</option>';

    const region = this.value;

    if (!regions[region]) return;

    regions[region].forEach(function (city) {

        const option = document.createElement("option");

        option.value = city;
        option.textContent = city;

        citySelect.appendChild(option);

    });

});

//   HÀM LẤY ICON THỜI TIẾT

function getWeatherIcon(weather) {

    weather = weather.toLowerCase();

    if (weather.includes("clear")) {
        return "☀️";
    }

    if (weather.includes("cloud")) {
        return "☁️";
    }

    if (weather.includes("rain")) {
        return "🌧";
    }

    if (weather.includes("drizzle")) {
        return "🌦";
    }

    if (weather.includes("thunderstorm")) {
        return "⛈";
    }

    if (weather.includes("snow")) {
        return "❄️";
    }

    if (
        weather.includes("mist") ||
        weather.includes("fog") ||
        weather.includes("haze")
    ) {
        return "🌫";
    }

    return "🌡";
}


//   LẤY THỜI TIẾT TỪ API

async function getWeather() {
    const city = citySelect.value;

    if (city === "") {
        alert("Vui lòng chọn tỉnh/thành");
        return;
    }

    const url =
         `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&lang=vi`;

    try {

        const response = await fetch(url);
        const result = await response.json();

        console.log(result);


        if (result.error) {
            document.getElementById("weather").innerHTML = result.error.message;
            return;
        }

        const weatherDesc = result.current.condition.text;
        const icon = getWeatherIcon(weatherDesc);

        document.getElementById("weather").innerHTML = `
            <h2>${result.location.name}</h2>
            <h3>${icon} ${weatherDesc}</h3>
            <p>Nhiệt độ: ${result.current.temp_c} °C</p>
            <p>Độ ẩm: ${result.current.humidity}%</p>
            <p>Gió: ${result.current.wind_kph} km/h</p>

        `;

    } catch (error) {

        console.log(error);

    }

}


//   ĐỒNG HỒ THỜI GIAN THỰC

function updateClock() {

    const now = new Date();

    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");

    document.getElementById("clock").innerText =
        `🕒 ${h}:${m}:${s}`;

}

setInterval(updateClock, 1000);
