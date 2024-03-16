    

const searchInput = document.getElementById('searchbar')

searchInput.addEventListener('keypress', function(event) {
    
    if (event.key === 'Enter' || event.keyCode === 13) {
       
       
        const searchQuery = searchInput.value.trim();
       
        const encodedSearchQuery = encodeURIComponent(searchQuery);
       
        const url = `/userhome/search?query=${encodedSearchQuery}`;
  
        window.location.href = url;
    }
});