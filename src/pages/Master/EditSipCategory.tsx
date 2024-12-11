import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';
import { useNavigate, useParams } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import url from '../../env';

import { usePageTitle } from '../../hooks';

import { toast } from 'react-toastify';


// Define the type for form data
type SipCategoryData = {
    sipcategory_name: string;
    sipcategory_status: boolean;
};

// Define the type for branch data
type Branch = {
    _id: string;
    branch_name: string;
};

// Function to get the authorization token from secure local storage
const getBearerToken = () => {
    return secureLocalStorage.getItem('login'); // Adjust if your method differs
};

// Validation schema
const schemaResolver = yupResolver(
    yup.object().shape({
        sipcategory_name: yup.string().required('Please enter the category name'),
        sipcategory_status: yup.boolean().required('Please select the category status'),
    })
);

const EditSipCategoryForm = () => {
    const { id } = useParams<{ id: string }>();
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const navigate = useNavigate();

    const userData:any = JSON.parse(StorageuserData);

    const { handleSubmit, control,setValue, formState: { errors } } = useForm<SipCategoryData>({
        resolver: schemaResolver,
        defaultValues: {
            sipcategory_status: true, // Default value if needed
        },
    });


    useEffect(() => {
        // Fetch branches from the backend

        const fetchSipCategory = async () => {
            try {
                const bearerToken = getBearerToken();
                const response = await fetch(`${url.nodeapipath}/sipcategory/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                });
                const data = await response.json();
                console.log(data);
                
                if (response.ok) {
                    // setSipSlab(data.sipSlab);
                    const sip_category = data.sip_category; // Access the first element in the branch array
                    setValue("sipcategory_name", sip_category.sipcategory_name)
                    setValue("sipcategory_status", sip_category.sipcategory_status)
                    // Set form values using branchData
                    // for (const key in reference_levels) {
                    //     if (reference_levels.hasOwnProperty(key)) {
                    //         setValue(key as keyof ReferenceLevelData, reference_levels[key]);
                            

                    //     }
                    // }

                } else {
                    console.error('Error fetching SIP Slab:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchSipCategory();
    }, []);

    const onSubmit = async (data: SipCategoryData) => {
        // console.log(data);
        

            // if(userData.staff_branch == '0' && clientbranch == '')
            // {
            //     setBranchErr(true);
            // }
            // else
            // {
                var DataToPost = {
                    sipcategory_name: data.sipcategory_name,
                    sipcategory_status: data.sipcategory_status,
                    // branch_id:(userData.staff_branch =='0')?clientbranch:userData.staff_branch
                    // branch_id:''
                }

                try {
                    const bearerToken = secureLocalStorage.getItem('login');
                    const response = await fetch(`${url.nodeapipath}/sipcategory/${id}`, {
                        body: JSON.stringify(DataToPost),
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin':'*',
                            'Authorization': `Bearer ${bearerToken}`
                        },
                        
                    });
                    const result = await response.json();
                    if (response.ok) {
                    // console.log('SIP Slab Add successfully:');
                        toast.success( result.message || 'SIP Category updated successfully');
                        navigate('/sipcategory')
                    }
                    else
                    {
                        toast.error(result.message || 'Failed to update sip category.');
                    }
                } catch (error) {
                    // console.error('Error during registration:', error);
                    toast.error('Failed to update sip category');
                }
            // }

    };


    return (
        <Card style={{marginTop:'25px'}}>
            <Card.Body>
                <h4 className="header-title mt-0 mb-1">Add Reference Level</h4>
                <p className="sub-header">Fill the form to add a new reference level.</p>
                <Form onSubmit={handleSubmit(onSubmit)}>
                     <Form.Group className="mb-2">
                        <Form.Label> Category Name</Form.Label>
                        <Controller
                            name="sipcategory_name"
                            control={control}
                            render={({ field }) => (
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Category"
                                    {...field}
                                    value={field.value ?? ""} // Fallback for undefined values
                                    isInvalid={!!errors.sipcategory_name}
                                />
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.sipcategory_name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Category Status</Form.Label>
                        <Controller
                                    name="sipcategory_status"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select
                                            {...field}
                                            value={field.value.toString()}
                                            onChange={(e) => field.onChange(e.target.value === 'true')} isInvalid={!!errors.sipcategory_status}>
                                            <option value="">Select status</option>
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </Form.Select>
                                    )}
                                />
                        <Form.Control.Feedback type="invalid">
                            {errors.sipcategory_status?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    {/* {(userData.user_role_type == '0') && (
                                <>
                                 <Form.Group className="mb-2">
                                 <Form.Label>Branch Name</Form.Label>
                                 <select className={(branchErr)?"form-control is-invalid":"form-control"} id="branch" onChange={(e)=>{handleBranchChange(e)}} >
                                         <option value="">-- Select --</option>
 
                                         {branches.map((branch) => (
                                             <option key={branch._id} value={branch._id}>
                                                 {branch.branch_name}
                                             </option>
                                             ))}
                                 </select>
                                 {(branchErr)?(<div className="invalid-feedback d-block">Please Select Branch</div>):''}
                             </Form.Group>
                             </>
                            )} */}

                    <div className="text-md-end mb-0">
                        <Button variant="primary" className="me-1" type="submit">
                            Submit
                        </Button>
                        <Button variant="secondary" type="reset">
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

const SipCategory = () => {

    usePageTitle({
        title: 'Edit SIP Category',
        breadCrumbItems: [
            {
                path: '/forms/validation',
                label: 'Forms',
            },
            {
                path: '/forms/validation',
                label: 'Validation',
                active: true,
            },
        ],
    });

    return (
        <Row>
            <Col lg={12}>
                <EditSipCategoryForm />
            </Col>
        </Row>
    );
};

export default SipCategory;
