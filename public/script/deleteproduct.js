function deleteuser(username) {
    fetch(`/adminhome/deleteproduct/${username}`, { method: "post" })
      .then((res) =>{
        console.log(res)
    
const result =res.json()

    console.log(result)
       return  res.json()}
      )
  
      .then((data) => {
        // console.log("hi");
        console.log(data);
        if (data) {
            // console.log(data)
        //   console.log("ok");
          alert("success");
  
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          alert("you are wrong");
        }
      });
  }