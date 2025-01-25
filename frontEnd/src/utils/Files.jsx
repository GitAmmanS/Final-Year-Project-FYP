Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error In Adding Products",
                width: "380px",
                height: "20px",
                customClass: {
                    confirmButton: "bg-[#22C55E] text-white",
                  },
            });


Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Data Saved Sucessfully",
                    showConfirmButton: false,
                    timer: 2000,
                    width: "380px",
                    height: "20px"
                });