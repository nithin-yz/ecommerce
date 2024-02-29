const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");
const close = document.getElementById("close");
if (bar) {
  bar.addEventListener("focus", () => {
    nav.classList.add("active");
  });
}
if (close) {
    close.addEventListener("focus", () => {
      nav.classList.remove("active");
    });
  }



const searchInput = document.getElementById('searchbar');






searchInput.addEventListener('keypress', function(event) {
    
    if (event.key === 'Enter' || event.keyCode === 13) {
       
       
        const searchQuery = searchInput.value.trim();
       
        const encodedSearchQuery = encodeURIComponent(searchQuery);
       
        const url = `/userhome/search?query=${encodedSearchQuery}`;
  
        window.location.href = url;
    }
});