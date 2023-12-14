import axios from 'axios';
import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from "@hookform/error-message"


const PetListingForm = forwardRef(({ onFormSubmitSuccess, predefinedValues }, ref) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: predefinedValues || {
            name: '',
            breed: '',
            age: '',
            size: '',
            color: '',
            gender: '',
            description: '',
            characteristics: '',
            avatar: null // Assuming avatar is a file input
        }
    });
    const isUpdate = () =>{
        // Check if predefinedValues is not null and has at least one key-value pair
        return predefinedValues && Object.keys(predefinedValues).length > 0;

    }
    
    const onSubmit = async (data) => {
        console.log('Form data on submit:', data);
        const petId = predefinedValues?.petId; // Assuming predefinedValues includes the pet ID
        const formData = new FormData();

        // Add fields to formData
        formData.append('name', data.name);
        formData.append('breed', data.breed);
        formData.append('age', data.age);
        formData.append('size', data.size);
        formData.append('color', data.color);
        formData.append('gender', data.gender);
        formData.append('description', data.description);
        formData.append('characteristics', data.characteristics);
        if (data.status && data.status.length > 0) {
          formData.append('status', data.status);
          } else 
          {
            formData.append('status', 'available');
          }
        
        if (data.avatar && data.avatar.length > 0) {
          formData.append('avatar', data.avatar[0]);
          } // Assuming avatar is a file input, take the first file
    
        if (!isUpdate()) {
            formData.append('shelter', localStorage.getItem('user_id'));
            formData.append('date_posted', Date.now());
        }
    
        const queryString = `http://127.0.0.1:8000/petListing/${isUpdate() ? `${petId}/` : ''}`;
        const accessToken = localStorage.getItem('access_token')
        console.log(formData)
        try {
            await axios({
                method: isUpdate() ? 'put' : 'post',
                url: queryString,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                },
            });
    
            // If successful:
            if (onFormSubmitSuccess) {
                onFormSubmitSuccess(); // Notify parent component of success
                console.log('Form submitted successfully');
            }
        } catch (error) {
            console.error(`Error ${isUpdate() ? 'updating' : 'creating'} pet listing:`, error);
        }
    };
    
      

    // Expose the submit function to parent via `ref`
    useImperativeHandle(ref, () => ({
        submitForm: () => handleSubmit(onSubmit)() // Correctly execute the function returned by handleSubmit
    }));
    


    const formStyle = {
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '20px',
    };

    const labelStyle = {
        fontSize: '1.2em', // Increase the font size of the label
        marginBottom: '5px', // Spacing between the label and input field
    };

    const getInputBorder = (isDisabled, oppsite) => ({
        padding: '10px',
        border: '2px solid #ccc',
        borderRadius: '4px',
        backgroundColor: (isDisabled  && oppsite)? '#f0f0f0' : 'white' // Grey background if disabled
    });

    const groupStyle = {
        display: 'flex',
        flexDirection: 'column',
    }

    const redText = {
        color: "#de1818"
    }


    return (
      <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
        <div style={groupStyle}>
          <label htmlFor="name" style={labelStyle}>
            Pet Name
          </label>
          <input
            id="name"
            style={getInputBorder(isUpdate(), true)}
            {...register("name", { required: true })}
            disabled={isUpdate()}
          />
          {errors.name && <span style={redText}>This field is required</span>}
        </div>

        <div style={groupStyle}>
          <label htmlFor="breed" style={labelStyle}>
            Breed
          </label>
          <input
            id="breed"
            style={getInputBorder(isUpdate(), true)}
            {...register("breed", { required: true })}
            disabled={isUpdate()}
          />
          {errors.breed && <span style={redText}> This field is required</span>}
        </div>

        <div style={groupStyle}>
          <label htmlFor="age" style={labelStyle}>
            Age
          </label>
          <input
            id="age"
            style={getInputBorder(isUpdate(), true)}
            {...register("age", {
              required: "This field is required",
              pattern: {
                value: /^[0-9]+$/, // Regex for positive numbers only
                message: "Please input a positive number",
              },
            })}
            disabled={isUpdate()}
          />
          <ErrorMessage
            errors={errors}
            name="age" // Match the field name
            render={({ message }) => <p style={redText}>{message}</p>}
          />
        </div>

        <div style={groupStyle}>
          <label htmlFor="size" style={labelStyle}>
            Size
          </label>
          <select
            id="size"
            style={getInputBorder(isUpdate(), true)}
            {...register("size", { required: true })}
            disabled={isUpdate()}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra_large">Extra Large</option>
          </select>
          {errors.size && <span style={redText}>This field is required</span>}
        </div>

        <div style={groupStyle}>
          <label htmlFor="color" style={labelStyle}>
            Color
          </label>
          <input
            id="color"
            style={getInputBorder(isUpdate(), true)}
            {...register("color", { required: true })}
            disabled={isUpdate()}
          />
          {errors.color && <span style={redText}>This field is required</span>}
        </div>

        <div style={groupStyle}>
          <label htmlFor="gender" style={labelStyle}>
            Gender
          </label>
          <select
            id="gender"
            style={getInputBorder(isUpdate(), true)}
            {...register("gender", { required: true })}
            disabled={isUpdate()}
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
          {errors.gender && <span style={redText}>This field is required</span>}
        </div>

        <div style={groupStyle}>
          <label htmlFor="description" style={labelStyle}>
            Description
          </label>
          <textarea
            id="description"
            style={getInputBorder(isUpdate(), false)}
            {...register("description", { required: true })}
          />
          {errors.description && (
            <span style={redText}>This field is required</span>
          )}
        </div>

        <div style={groupStyle}>
          <label htmlFor="characteristics" style={labelStyle}>
            Characteristics
          </label>
          <input
            id="characteristics"
            style={getInputBorder(isUpdate(), false)}
            {...register("characteristics", { required: true })}
          />
          {errors.characteristics && (
            <span style={redText}>This field is required</span>
          )}
        </div>

        <div style={groupStyle}>
          <label htmlFor="avatar" style={labelStyle}>
            Avatar
          </label>
          <input
            id="avatar"
            type="file"
            style={getInputBorder(isUpdate(), false)}
            {...register("avatar")}
          />
        </div>

        <div style={groupStyle}>
          <label htmlFor="status" style={labelStyle}>
            Status
          </label>
          <select
            id="status"
            style={getInputBorder(isUpdate(), false)}
            {...register("status")}
            disabled={!isUpdate()}
          >
            <option value="available">Available</option>
            <option value="adopted">Adopted</option>
            <option value="pending">Pending</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </form>
    );
});


export default PetListingForm;
