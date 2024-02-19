
const urlParams = new URLSearchParams(window.location.search);

const alertMessage = urlParams.get('alert');

if (alertMessage) {
    
   
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.textContent = alertMessage;
    alertDiv.classList.add('show');
}
