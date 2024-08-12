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

type Department = {
    _id: string;
    department_name: string;
};

// Define the type for form data
type DesignationData = {
    designation_name: string;
    department_name: string; // This will be the ID of the department
    designation_status: boolean;
};

const schemaResolver = yupResolver(
    yup.object().shape({
        designation_name: yup.string().required('Please enter Designation Name'),
        department_name: yup.string().required('Please select a Department'),
        designation_status: yup.bool().required('Please select Designation Status'),
    })
);

const EditDesignation = () => {
    const { id } = useParams<{ id: string }>();
    const [departments, setDepartments] = useState<Department[]>([]);
    const navigate = useNavigate();

    const { control, handleSubmit, reset, setValue,formState:{errors},register } = useForm<DesignationData>({
        resolver: schemaResolver,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');

                const response = await fetch(`${url.nodeapipath}/department/all/0`,{
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
                    setDepartments(data.department || []);
                } else {
                    console.error('Error fetching departments:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchDepartments();

        const fetchDesignationData = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');

                const response = await fetch(`${url.nodeapipath}/designation/${id}`,{
                    method:'GET',
                    headers: {
                        'Content-Type':'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                        }
                });
                if (!response.ok) {
                    throw new Error('Error fetching branch data');
                }
                const data = await response.json();

                if (data && data.designation && Array.isArray(data.designation) && data.designation.length > 0) {
                    const designationData = data.designation[0]; // Access the first element in the branch array

                    // Set form values using branchData
                    for (const key in designationData) {
                        if (designationData.hasOwnProperty(key)) {
                            setValue(key as keyof DesignationData, designationData[key]);
                        }
                    }
                } else {
                    throw new Error('Designation data is empty or invalid');
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

        fetchDesignationData();
    }, [id, setValue]);

    const onSubmit = async (formData: DesignationData) => {
        try {
            const bearerToken = secureLocalStorage.getItem('login');
            const response = await fetch(`${url.nodeapipath}/designation/${id}`, {
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
                throw new Error(result.message || 'Error updating branch');
            }

            navigate('/designation'); // Redirect after successful update
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
        <Card style={{marginTop:'25px'}}>
            <Card.Body>
                <h4 className="header-title mt-0 mb-1">Edit Designation</h4>
                <p className="sub-header">Modify the details of the designation.</p>
                <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-2">
                        <Form.Label>Designation Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter designation name"
                            {...register('designation_name')}
                            isInvalid={!!errors.designation_name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.designation_name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Department Name</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            {...register('department_name')}
                            isInvalid={!!errors.department_name}
                        >
                            <option value="">Select a department</option>
                            {departments.map((department) => (
                                <option key={department._id} value={department._id}>
                                    {department.department_name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.department_name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                                <Form.Label>Status</Form.Label>
                                <Controller
                                    name="designation_status"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select
                                            {...field}
                                            value={field.value.toString()}
                                            onChange={(e) => field.onChange(e.target.value === 'true')}>
                                            <option value="">Select status</option>
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </Form.Select>
                                    )}
                                />
                    </Form.Group>

                    <div className="text-md-end mb-0">
                        <Button variant="primary" className="me-1" type="submit">
                            Update
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/designation')}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default EditDesignation;
