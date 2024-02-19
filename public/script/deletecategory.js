document.querySelectorAll(".delete-category").forEach((button) => {
  button.addEventListener("click", async (event) => {
    const deleteid = await event.currentTarget.getAttribute("data-id");
    console.log(deleteid);

    const parentDiv = event.currentTarget.parentNode;
    console.log(parentDiv);

    try {
      fetch("/delete/category", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteid }),
      }).then((res) => {
        if (res.ok) {
          parentDiv.remove();
        } else {
          console.log("error happened");
        }
      });
    } catch {
      console.log(error);
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {

  const buttons = document.querySelectorAll(".delete-sub");
 
  buttons.forEach(function (button) {
    button.addEventListener("click", async(event) => {
        console.log(event.currentTarget);
      const selectoneid = event.currentTarget.getAttribute("data-id");
    
      const parent = event.currentTarget.closest("li");
      const subcat = parent.querySelector('span').textContent;

 
      try {

        fetch("/delete/subcategory", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id:selectoneid,subcategory:subcat }),
        }).then((res) => {
          if (res.ok) {
            parent.remove();
          } else {
            console.log("error happened");
          }
        });
      } catch {
        console.log(error);
      }





    });
  });
});
