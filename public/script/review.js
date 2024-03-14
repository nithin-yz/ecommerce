
var timestamp = "<%=order.createdAt%>";

    // Parse the timestamp
    var dateObj = new Date(timestamp);

    // Extract date components
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth() + 1; // Months are 0-based, so adding 1
    var day = dateObj.getDate();

    // Format the date
    var formattedDate = + (day < 10 ? "0" + day : day)+"-" + (month < 10 ? "0" + month : month) + "-" + year 

    // Display the formatted date
    document.getElementById("formattedDate").textContent = formattedDate; 


    const status1 = "<%=order.status%>"
    var shippedElement = document.querySelector(".shipped");
    var deliveredElement = document.querySelector(".delivered");
    var middle = document.querySelector(".middle")

    if (status1 === "cancelled") {
          
            document.getElementById("oText").style.color = "red";
           
            var shippedElement = document.querySelector(".shipped");
            if (shippedElement) {
                shippedElement.remove();
            }
            if (deliveredElement) {
                deliveredElement.style.color = "red";
                deliveredElement.textContent = "Cancelled";
            }
        } else if (status1=== "shipped") {
            shippedElement.remove();
            middle.remove()
            deliveredElement.textContent = "shipped";

        }else if(status1=="pending") {
            
            shippedElement.remove();
            middle.remove()
            deliveredElement.textContent = "pending(on progress)";
        }
            
            else {
           console.log("hey")
            deliveredElement.textContent = "Delivered"
            // document.querySelector(".delivered").style.color = "blue";
        }
    
    


        const errorelement= document.getElementById('response')
document.getElementById("rateAndReview").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("reviewForm").style.display = "block"
         
        document.getElementById("background").style.display = "none"
         
        document.body.classList.add("blur"); // Add blur effect to background
      });

      // JavaScript to hide the review form
      document.getElementById("cancelButton").addEventListener("click", function(event) {
        event.preventDefault();
        errorelement.innerText=""
        document.getElementById("reviewForm").style.display = "none"; 
        document.getElementById("background").style.display = "block"// Hide the review form
        // document.body.classList.remove("blur"); // Remove blur effect from background
      });




      document.getElementById("reviewForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        
        const formData = new URLSearchParams()
    const product= document.getElementById('selectedproduct')
    
    formData.append('productid',product.value)
    
    
    // Add remaining form elements to formData
    formData.append('description', document.getElementById('description').value);
    formData.append('rating', document.getElementById('ratingInput').value);
    
    
    const buttonss = document.getElementById('formbutton')
        console.log(formData)
        try {
        const response = await fetch("/user/submitreview", {
            method: "POST",
            body: formData,
            headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
     
        });
        console.log(response)
        if (response.ok) {
            console.log("Review submitted successfully!");
            errorelement.style.color="red"
            errorelement.innerText="Review submitted sucessfully"
    // formbutton.remove()
    
        } else {
          
        
            const wait = await response.json()
            
    if(wait.login=="login"){
    
    console.log(wait.login)
    
    window.location.href="/login"
    return
    }else{
    
    
      console.log("Review already submitted ");
            errorelement.innerText="Review already submitted"
            errorelement.style.color="red"
    return
    }
    
            
    
      
            
          }
    
    
       
    
        }
        
        catch (error) {
            console.log("Error submitting review:", error);
        }
    })
    
    
    
    
const ratingInput = document.getElementById("ratingInput")
console.log(ratingInput)
ratingInput.addEventListener("keyup", function() {
  console.log("hi")
    let rating = parseInt(ratingInput.value);
    console.log(rating)

  
    if (rating > 5) {
      rating = 5;
    }
  
    else if (rating < 1) {
      rating = 1;
    }

    // Update the input field value
    this.value = rating;
  });