function previewImage(event, previewId) {
    const preview = document.getElementById(previewId);
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }






     

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
    }
}


