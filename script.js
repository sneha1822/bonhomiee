// Destination data with sightseeing optionss
const destinationData = {
    "Athens": ["Parthenon", "City Tour", "Tour to Delphi", "Meteora"],
    "Santorini": ["Oia Sunset Tour", "Volcano Cruise", "Red Beach", "Ancient Thera"],
    "Mykonos": ["Windmills Tour", "Delos Island", "Beach Hopping", "Little Venice"],
    "Rhodes": ["Medieval Old Town", "Lindos Acropolis", "Anthony Quinn Bay", "Prasonisi Beach"]
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Your existing destination card click handlers...
  
  // Add single form submission handler:
    document.getElementById('tripForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 1. Collect all data
    const formData = collectFormData();
    const formattedText = formatFormData(formData);

    // 2. Create hidden textarea for email body
    const hiddenInput = document.createElement('textarea');
    hiddenInput.name = 'itinerary';
    hiddenInput.style.display = 'none';
    hiddenInput.textContent = formattedText;
    this.appendChild(hiddenInput);

    // 3. Submit (with fallback)
    if (!navigator.onLine) {
        alert('You appear to be offline. Here is your itinerary to copy:\n\n' + formattedText);
    } else {
        this.submit(); // FormSubmit will handle the email
    }
    });


});


function formatFormData(formData) {
  return `
    ============================================
            TRIP ITINERARY SUMMARY
    ============================================

    CUSTOMER DETAILS:
    -----------------
    Name: ${formData.customer.name}
    Email: ${formData.customer.email}
    WhatsApp: ${formData.customer.whatsapp}

    ITINERARY:
    ----------
    ${formData.itinerary.map(destination => `
    📍 ${destination.destination} (${destination.duration} days)
    • Accommodation: ${destination.accommodation}
    • Sightseeing: ${destination.sightseeing.join(', ') || 'None selected'}
    `).join('')}

    FLIGHT DETAILS:
    ---------------
    ✈ Departure From: ${formData.flightDetails.departureCity}
    📅 Departure Date: ${formData.flightDetails.departureDate}
    💺 Seat Preference: ${formData.flightDetails.seatPreference}
    👥 Passengers: ${formData.flightDetails.passengers}
    🛫 Cabin Class: ${formData.flightDetails.cabinClass}
    🍽 Meal Preference: ${formData.flightDetails.mealPreference}
    📝 Special Requests: ${formData.flightDetails.specialRequests || 'None'}

    SUMMARY:
    --------
    📅 Total Trip Duration: ${formData.summary.totalDays} days
    🌍 Destinations Visited: ${formData.summary.totalDestinations}

    ============================================
        THANK YOU FOR YOUR BOOKING!
    ============================================
    `;
}

document.querySelectorAll('.destination-card').forEach(card => {
  card.addEventListener('click', function() {
    const destination = this.dataset.destination;
    if (!document.querySelector(`.itinerary-card[data-destination="${destination}"]`)) {
      addToItinerary(destination, destinationData[destination]);
      updateSummary();
    }
  });
});


document.getElementById('tripForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = collectFormData();
  console.log('Final Form Data:', JSON.stringify(formData, null, 2));
  // Add your email/SMTP logic here later
});


// Add destination to itinerary
function addToItinerary(destination, sights) {
    const itineraryContent = document.getElementById('itinerary-content');
    
    // Create destination card
    const card = document.createElement('div');
    card.className = 'itinerary-card';
    card.dataset.destination = destination;

     const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '×'; // Close icon
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Remove destination';
        deleteBtn.addEventListener('click', () => {
            card.remove();
            updateSummary();
        });

    card.appendChild(deleteBtn);
    
    // Add destination heading
    const heading = document.createElement('h3');
    heading.textContent = destination;
    card.appendChild(heading);
    
    // Add duration input
    const durationDiv = document.createElement('div');
    durationDiv.className = 'duration-input';
    
    const durationLabel = document.createElement('label');
    durationLabel.textContent = 'Duration (days): ';
    
    const durationInput = document.createElement('input');
    durationInput.type = 'number';
    durationInput.min = '1';
    durationInput.value = '1';
    durationInput.className = 'duration';
    durationInput.dataset.destination = destination;
    
    durationInput.addEventListener('change', updateSummary);
    
    durationDiv.appendChild(durationLabel);
    durationDiv.appendChild(durationInput);
    card.appendChild(durationDiv);
    
    // Add accommodation selection
    const accommodationDiv = document.createElement('div');
    accommodationDiv.className = 'accommodation-selection';
    
    const accommodationLabel = document.createElement('label');
    accommodationLabel.textContent = 'Accommodation: ';
    accommodationDiv.appendChild(accommodationLabel);
    
    const accommodationOptions = ['3 Stars', '4 Stars', '5 Stars', '7 Stars'];
    accommodationOptions.forEach(option => {
        const label = document.createElement('label');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `${destination.toLowerCase()}-accommodation`;
        radio.value = option;
        radio.required = true;
        
        // Set 4 Stars as default selected
        if (option === '4 Stars') {
            radio.checked = true;
        }
        
        label.appendChild(radio);
        label.appendChild(document.createTextNode(` Hotel - (${option})`));
        accommodationDiv.appendChild(label);
        accommodationDiv.appendChild(document.createElement('br'));
    });
    
    card.appendChild(accommodationDiv);
    
    // Add sightseeing checkboxes
    const sightsList = document.createElement('div');
    sightsList.className = 'sights-list';
    
    sights.forEach(sight => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = `${destination.toLowerCase()}-sights`;
        checkbox.value = sight;
        
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${sight}`));
        sightsList.appendChild(label);
        sightsList.appendChild(document.createElement('br'));
    });
    
    card.appendChild(sightsList);
    itineraryContent.appendChild(card);
}

// Update summary totals
function updateSummary() {
    const destinationCards = document.querySelectorAll('.itinerary-card');
    let totalDays = 0;
    
    destinationCards.forEach(card => {
        const durationInput = card.querySelector('.duration');
        totalDays += parseInt(durationInput.value) || 0;
    });
    
    document.getElementById('total-days').textContent = totalDays;
    document.getElementById('total-destinations').textContent = destinationCards.length;
}


function collectFormData() {
  const formData = {
    customer: {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      whatsapp: document.getElementById('whatsapp').value
    },
    itinerary: [],
    summary: {
      totalDays: parseInt(document.getElementById('total-days').textContent),
      totalDestinations: parseInt(document.getElementById('total-destinations').textContent)
    }
  };

  // Add itinerary items
  document.querySelectorAll('.itinerary-card').forEach(card => {
    const destination = card.dataset.destination;
    formData.itinerary.push({
      destination: destination,
      duration: parseInt(card.querySelector('.duration').value),
      accommodation: card.querySelector('input[name*="accommodation"]:checked')?.value || 'Not selected',
      sightseeing: Array.from(card.querySelectorAll('.sights-list input:checked')).map(el => el.value)
    });
  });

  // Add flight details
  const flightSection = document.querySelector('#flight-section');
  if (flightSection) {
    formData.itinerary[0].flightDetails = {
      departureCity: flightSection.querySelector('#departure-city').value,
      departureDate: flightSection.querySelector('#departure-date').value,
      seatPreference: flightSection.querySelector('input[name="seat-preference"]:checked')?.value,
      passengers: parseInt(flightSection.querySelector('#passengers').value),
      cabinClass: flightSection.querySelector('#cabin-class').value,
      mealPreference: flightSection.querySelector('#meal-preference').value,
      specialRequests: flightSection.querySelector('#special-requests').value
    };
  }

   // Add flight details
    formData.flightDetails = {
    departureCity: document.getElementById('departure-city').value,
    departureDate: document.getElementById('departure-date').value,
    seatPreference: document.querySelector('input[name="seat-preference"]:checked').value,
    passengers: parseInt(document.getElementById('passengers').value),
    cabinClass: document.getElementById('cabin-class').value,
    mealPreference: document.getElementById('meal-preference').value,
    specialRequests: document.getElementById('special-requests').value
    };

  return formData;
}

// Test it
console.log(JSON.stringify(collectFormData(), null, 2));