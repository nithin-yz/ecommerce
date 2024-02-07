function deleteuser(username) {
  fetch(`/adminhome/deleteuser/${username}`, { method: "post" })
    .then((res) =>
      // console.log(res)
      res.json()
    )

    .then((data) => {
      console.log("hi");
      console.log(data);
      if (data) {
        console.log("ok");
        alert("success");

        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        alert("you are wrong");
      }
    });
}
