// Toggle password visibility
document.addEventListener('DOMContentLoaded', function() {
  const passwordToggles = document.querySelectorAll('.password-toggle');
  
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const passwordField = this.previousElementSibling;
      
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
      } else {
        passwordField.type = 'password';
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
      }
    });
  });

  // User type selector
  const selectorButtons = document.querySelectorAll('.selector-button');
  
  selectorButtons.forEach(button => {
    button.addEventListener('click', function() {
      selectorButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Add subtle animation when pages load
  document.body.classList.add('fade-in');

  // Calendar date selection
  const dates = document.querySelectorAll('.date:not(.faded)');
  let startDate = null;
  let endDate = null;

  dates.forEach(date => {
    date.addEventListener('click', function() {
      // If no start date is selected or both dates are selected, reset selection
      if (!startDate || (startDate && endDate)) {
        // Clear all selections
        dates.forEach(d => {
          d.classList.remove('selected');
          d.classList.remove('selected-range');
        });
        
        startDate = parseInt(this.textContent);
        this.classList.add('selected');
        endDate = null;
      } 
      // If start date is selected but end date is not
      else if (startDate && !endDate) {
        endDate = parseInt(this.textContent);
        
        // Make sure end date is after start date
        if (endDate < startDate) {
          const temp = startDate;
          startDate = endDate;
          endDate = temp;
        }
        
        this.classList.add('selected');
        
        // Add selected-range class to dates between start and end
        dates.forEach(d => {
          const dateNum = parseInt(d.textContent);
          if (dateNum > startDate && dateNum < endDate) {
            d.classList.add('selected-range');
          }
        });
      }
    });
  });

  // Add animation to map markers
  const markers = document.querySelectorAll('.map-marker');
  markers.forEach((marker, index) => {
    marker.style.animationDelay = `${index * 0.5}s`;
  });

  // Initialize header transparency effect on scroll for preview page
  if (document.querySelector('.preview-page')) {
    const header = document.querySelector('.header.transparent');
    const previewImage = document.querySelector('.preview-image');
    
    if (header && previewImage) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > previewImage.offsetHeight - 100) {
          header.classList.add('solid-bg');
        } else {
          header.classList.remove('solid-bg');
        }
      });
    }
  }
});

// Add CSS for the fade-in effect and header transparency
const style = document.createElement('style');
style.textContent = `
  body {
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  body.fade-in {
    opacity: 1;
  }
  
  .header.transparent.solid-bg {
    background-color: var(--card-bg);
    box-shadow: var(--shadow-sm);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function () {
  const map = L.map('map').setView([-7.5585, 110.8297], 13);

  // Tambahkan layer peta dari OpenStreetMap
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const myIcon = L.divIcon({
    className: 'custom-marker blue-marker',
    html: '<div class="map-marker blue-marker" style="width: 18px; height: 18px;"></div>',
    iconSize: [4, 4],
    iconAnchor: [24, 24],
  });

  const myIconRed = L.divIcon({
    className: 'custom-marker red-marker',
    html: '<div class="map-marker red-marker" style="width: 16px; height: 16px;"></div>',
    iconSize: [4, 4],
    iconAnchor: [24, 24],
  });

  L.marker([-7.5585, 110.8297], { icon: myIcon }).addTo(map);
  L.marker([-7.5412, 110.840], { icon: myIcon }).addTo(map);
  L.marker([-7.5490, 110.8250], { icon: myIconRed }).addTo(map);
});

document.addEventListener('DOMContentLoaded', function () {
  const dateSpans = document.querySelectorAll(".date");
  let startDate = null;
  let endDate = null;
  let selectedBoxPrice = 6200;
  const boxButtons = document.querySelectorAll(".box-option");

  boxButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      boxButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedBoxPrice = parseInt(btn.dataset.price);
      if (startDate && endDate) updateRange();
    });
  });

  dateSpans.forEach((span, index) => {
    span.addEventListener("click", () => {
      const selectedDay = parseInt(span.textContent);

      if (startDate && endDate) {
        clearSelection();
      }

      if (!startDate) {
        startDate = { day: selectedDay, index };
        span.classList.add("selected");
      } else if (!endDate && selectedDay >= startDate.day) {
        endDate = { day: selectedDay, index };
        updateRange();
      }
    });
  });

  function updateRange() {
    const range = endDate.day - startDate.day + 1;
    for (let i = startDate.index + 1; i < endDate.index; i++) {
      dateSpans[i].classList.add("selected-range");
    }

    const startText = `14 March 2025`.replace("14", startDate.day);
    const endText = `18 March 2025`.replace("18", endDate.day);

    document.getElementById("start-date").textContent = startText;
    document.getElementById("end-date").textContent = endText;

    const days = endDate.day - startDate.day + 1;
    document.getElementById("duration").textContent = `${days} day${days > 1 ? "s" : ""}`;

    const fee = days * selectedBoxPrice;
    const serviceFee = Math.round(fee * 0.11);
    const total = fee + serviceFee;

    document.getElementById("storage-fee").textContent = formatRupiah(fee);
    document.getElementById("total-fee").textContent = formatRupiah(total);
    document.getElementById("service-fee").textContent = formatRupiah(serviceFee);
  }

  function clearSelection() {
    startDate = null;
    endDate = null;
    dateSpans.forEach(span => {
      span.classList.remove("selected", "selected-range");
    });
  }

  function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
  }
});



