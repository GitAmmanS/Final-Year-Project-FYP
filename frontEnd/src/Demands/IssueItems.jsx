import React, { useState, useRef } from 'react';
import { Second } from './DemandForm';
import { BaseUrl } from '../utils/BaseUrl';
import Print from '../Prints/Print';
import jsPDF from 'jspdf';
import axios from 'axios';
import Loader from '../../src/Loading/loading'
import Swal from 'sweetalert2'

let locales;
const language = localStorage.getItem("language");
if (language === "english") {
  import("../locales/en.json").then((module) => {
    locales = module.default;
  });
} else {
  import("../locales/ur.json").then((module) => {
    locales = module.default;
  });
}

const IssueItems = () => {
  const printableRef = useRef();
  const [loader, setLoader] = useState(false);
  const [step, setStep] = useState(1);
  const userName = JSON.parse(localStorage.getItem('userName'));
  const [formData, setFormData] = useState({
    userName: userName,
    description: '',
    quantities: {},
  });
  const [demandData, setDemandData] = useState([]);


  const handleNext = () => {

    if (step === 1 && !formData.description) {
      Swal.fire({
        icon: "warning",
        title: "Description Required",
        text: "Description is required",
        width: "380px",
        height: "20px",
        customClass: {
          confirmButton: "bg-[#22C55E] text-white",
        },
      });
      return;
    }
    if (step === 2 && (!formData.selectedProducts || formData.selectedProducts.length === 0)) {

      Swal.fire({
        icon: "warning",
        title: "Select Products",
        text: "Atleast one product is required",
        width: "380px",
        height: "20px",
        customClass: {
          confirmButton: "bg-[#22C55E] text-white",
        },
      });
      return;
    }
    if (step === 3 && (!formData.quantities)) {

      Swal.fire({
        icon: "warning",
        title: "Select Products",
        text: "Atleast one product is required",
        width: "380px",
        height: "20px",
        customClass: {
          confirmButton: "bg-[#22C55E] text-white",
        },
      });
      return;
    }

    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    console.log(formData);
    if (Object.values(formData.quantities).some((value) => value.trim() === "") || formData.quantities===null ) {
      Swal.fire({
        icon: "warning",
        title: "Select Quantity",
        text: "Please enter quanity for products",
        width: "380px",
        height: "20px",
        customClass: {
            confirmButton: "bg-[#22C55E] text-white",
          },
    });
  }
  else{
      e.preventDefault();
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton:
            "bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 ml-4 rounded shadow",
          cancelButton:
            "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Submit Demand?",
          text: "Press Yes to submit demand",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            SubmitDemand();
          }
        });

      const SubmitDemand = async () => {
        try {
          console.log("Form Submitted:", formData);

          const response = await axios.post(`${BaseUrl}/demand/post`, formData);
          console.log(response.data.data.number);

          setLoader(true);
          const resp = await axios.get(
            `${BaseUrl}/demand/getById/${response.data.data.number}`
          );
          console.log(resp.data.data);
          setDemandData(resp.data.data);
          await sleep(2000);

          swalWithBootstrapButtons
            .fire({
              title: "Print Demand",
              text: "Are you sure you want to print this?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes",
              cancelButtonText: "No",
              reverseButtons: true,
            })
            .then((result) => {
              if (result.isConfirmed) {
                const doc = new jsPDF();
                const content = printableRef.current;

                if (content) {
                  setLoader(false);
                  doc.html(content, {
                    callback: function (doc) {
                      const pdfOutput = doc.output("blob");
                      const pdfUrl = URL.createObjectURL(pdfOutput);
                      window.open(pdfUrl, "_blank");
                    },
                  });
                }
              } else {
                setLoader(false);
              }

              clearFields();
            });
        } catch (error) {
          console.error("Error in Submitting:", error);
        }
      };
    }
  };



  const handleChangeSecond = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value, 
      quantities: value.reduce((acc, quantity) => {
        acc[quantity.id] = ""; 
        return acc;
      }, {}),
    }));
  };
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value, 
    }));
  };

  const handleQuantityChange = (product, quantity) => {
    setFormData((prev) => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [product]: quantity,
      },
    }));
  };

  const clearFields = () => {
    setFormData({
      userName: userName,
      description: '',
      quantities: {},
    });
    setDemandData([]);
    setStep(1);
  };

  return (
    <>
      <div>
        {
          loader ? (<div className='text-center flex justify-center items-center min-w-[100px] min-h-[500px]'>
            <Loader type="balls" color="#2C6B38" />
          </div>) :
            (
              <>
                {step === 1 && (
                  <div className="bg-white p-8 rounded-lg shadow-md w-3/4 mx-auto mt-5">
                    <div className="flex justify-between mb-6">
                      <h1 className="text-xl font-semibold text-gray-900">Demand For Issue Items</h1>
                    </div>
                    <h2 className="text-base text-gray-700 mb-4">Step 1: Demand Details</h2>
                    <form className="space-y-6 text-sm">
                      <div className="flex flex-col">
                        <label className="text-gray-600">Generated By:</label>
                        <input
                          type="text"
                          readOnly
                          placeholder="User"
                          value={formData.userName}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-gray-600">Description:</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          rows="4"
                          cols="60"
                          onChange={(e) => handleChange('description', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        />
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={clearFields}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                        >
                          Next
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {step === 2 && (
                  <div className="bg-white p-8 rounded-lg shadow-md  mx-auto mt-5">
                      <h2 className="text-base text-gray-700 mb-4">Step 3: Select Products</h2>
                    <Second
                      onSelectProducts={(selectedProducts) => {
                        handleChangeSecond('selectedProducts', selectedProducts);
                      }}
                    />
                    <div className="flex justify-between mt-4 text-sm">
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="bg-white p-8 rounded-lg shadow-md w-3/4 mx-auto mt-5 ">
                    <div className="flex flex-col justify-center items-center ">
                      <h2 className="text-base text-gray-700 mb-4">Step 3: Enter Quantity</h2>
                      <p className="text-gray-600 text-sm mb-4">Selected Product(s): {formData.selectedProducts.length}</p>
                      {formData.selectedProducts.map((product, index) => (
                        <div key={index} className="flex flex-col mb-4 text-sm">
                          <label className="text-gray-600">Quantity for {product.name}:</label>
                          <input
                            type="number"
                            min="1"
                            value={formData.quantities[product.id]}
                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      ))}
                      <div className="flex justify-between mt-4 text-sm">
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </>
            )
        }
      </div>
      {demandData.items && demandData.items.length > 0 && (
        <div style={{ display: 'none' }}>
          <Print ref={printableRef} data={demandData} name="Demand" subject="Request for Products" dateAndTime="createdAt" />
        </div>
      )}


    </>
  );
};

export default IssueItems;
