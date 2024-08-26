import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import url from '../../env';
// hooks
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Define the type for department data
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

const BasicForm = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const navigate = useNavigate()
    useEffect(() => {
        // Fetch departments from the backend
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
    }, []);

    /*
    form validation schema
    */
    const schemaResolver = yupResolver(
        yup.object().shape({
            designation_name: yup.string().required('Please enter Designation Name'),
            department_name: yup.string().required('Please select a Department'),
            designation_status: yup.bool().required('Please select Designation Status'),
        })
    );

    const { control,handleSubmit, register, formState: { errors } } = useForm<DesignationData>({
        resolver: schemaResolver,
        defaultValues: {
            designation_status: true, // Default value if needed
        },
    });

    const onSubmit = async (formData: DesignationData) => {
        try {
            const bearerToken = secureLocalStorage.getItem('login');

            const response = await fetch(`${url.nodeapipath}/designation/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            // console.log(result);

            if (response.ok) {
                // console.log('Designation added successfully:', result);
                toast.success( result.message || 'Designation added successfully');
                navigate('/designation')
            } else {
                // console.error('Error adding designation:', result);
                toast.error(result.message || 'Failed to add designation.');
            }
        } catch (error) {
            console.error('Error during API call:', error);
        }
    };

    return (
        <Card style={{marginTop:'25px'}}>
            <Card.Body>
                <h4 className="header-title mt-0 mb-1">Add Designation</h4>
                <p className="sub-header">Fill the form to add a new designation.</p>
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

const AddDesignation = () => {
    usePageTitle({
        title: 'Add Designation',
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
                <BasicForm />
            </Col>
        </Row>
    );
};

export default AddDesignation;
