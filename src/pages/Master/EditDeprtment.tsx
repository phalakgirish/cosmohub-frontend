import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import url from '../../env';
// hooks
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';

type BranchData = {
    branch_name: string;
    branch_contact_person: string;
    branch_mobile_number: string;
    branch_emailId: string;
    branch_area: string;
    branch_city: string;
    branch_district: string;
    branch_taluka: string;
    branch_pincode: string;
    branch_status: boolean;
};

// Define the type for branch data
type Branch = {
    _id: string;
    branch_name: string;
};

// Define the type for form data
type DepartmentData = {
    department_name: string;
    branch_name: string; // This will be the ID of the branch
    department_status: boolean;
};



const EditDepartment = () => {
    const { id } = useParams<{ id: string }>();
    const [branches, setBranches] = useState<Branch[]>([]);
    const navigate = useNavigate();

    const schemaResolver = yupResolver(
        yup.object().shape({
            department_name: yup.string().required('Please enter Department Name'),
            branch_name: yup.string().required('Please select a Branch'),
            department_status: yup.bool().required('Please select Department Status'),
        })
    );

    const { control, handleSubmit, reset, setValue,register,formState: { errors } } = useForm<DepartmentData>({
        resolver: schemaResolver,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchBranches = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/branch/all/all`,{
                    method:'GET',
                    headers: {
                        'Content-Type':'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                        }
                });
                const data = await response.json();
                console.log(data);
                
                if (response.ok) {
                    setBranches(data.branch || []);
                } else {
                    console.error('Error fetching branches:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchBranches();

        const fetchDepartmentData = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/department/${id}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    }});
                if (!response.ok) {
                    throw new Error('Error fetching branch data');
                }
                const data = await response.json();

                if (data && data.department && Array.isArray(data.department) && data.department.length > 0) {
                    const departmentData = data.department[0]; // Access the first element in the branch array

                    // Set form values using branchData
                    for (const key in departmentData) {
                        if (departmentData.hasOwnProperty(key)) {
                            setValue(key as keyof DepartmentData, departmentData[key]);
                        }
                    }
                } else {
                    throw new Error('Department data is empty or invalid');
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDepartmentData();
    }, [id, setValue]);

    const onSubmit = async (formData: DepartmentData) => {
        try {
            // console.log(formData);
            const bearerToken = secureLocalStorage.getItem('login');
            
            const response = await fetch(`${url.nodeapipath}/department/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const result = await response.json();
                // navigate('/department')
                throw new Error(result.message || 'Error updating branch');
            }

             navigate('/department'); // Redirect after successful update
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred during API call');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Card>
            <Card.Body>
                <h4 className="header-title mt-0 mb-1">Edit Branch</h4>
                <p className="sub-header">Modify the details of the branch.</p>
                <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-2">
                        <Form.Label>Department Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter department name"
                            {...register('department_name')}
                            isInvalid={!!errors.department_name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.department_name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group  className="mb-2">
                        <Form.Label>Branch Name</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            {...register('branch_name')}
                            isInvalid={!!errors.branch_name}
                        >
                            <option value="">Select a branch</option>
                            {branches.map((branch) => (
                                <option key={branch._id} value={branch._id}>
                                    {branch.branch_name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.branch_name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Check
                            type="checkbox"
                            label="Department Status"
                            {...register('department_status')}
                            isInvalid={!!errors.department_status}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.department_status?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <div className="text-md-end mb-0">
                        <Button variant="primary" className="me-1" type="submit">
                            Update
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/department')}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default EditDepartment;
