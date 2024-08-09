import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import url from '../../env';
// hooks
import { usePageTitle } from '../../hooks';

// Define the type for department data
type Department = {
    _id: string;
    department_name: string;
};

// Define the type for form data
type DesignationData = {
    designation_name: string;
    designation_desc: string;
    department_name: string; // This will be the ID of the department
    designation_status: boolean;
};

const BasicForm = () => {
    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        // Fetch departments from the backend
        const fetchDepartments = async () => {
            try {
                const response = await fetch(`${url.nodeapipath}/department/`);
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
    }, []);

    /*
    form validation schema
    */
    const schemaResolver = yupResolver(
        yup.object().shape({
            designation_name: yup.string().required('Please enter Designation Name'),
            designation_desc: yup.string().required('Please enter Designation Description'),
            department_name: yup.string().required('Please select a Department'),
            designation_status: yup.bool().required('Please select Designation Status'),
        })
    );

    const { handleSubmit, register, formState: { errors } } = useForm<DesignationData>({
        resolver: schemaResolver,
    });

    const onSubmit = async (formData: DesignationData) => {
        try {
            const response = await fetch(`${url.nodeapipath}/designation/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log(result);

            if (response.ok) {
                console.log('Designation added successfully:', result);
            } else {
                console.error('Error adding designation:', result);
            }
        } catch (error) {
            console.error('Error during API call:', error);
        }
    };

    return (
        <Card>
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
                        <Form.Label>Designation Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter designation description"
                            {...register('designation_desc')}
                            isInvalid={!!errors.designation_desc}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.designation_desc?.message}
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
                        <Form.Check
                            type="checkbox"
                            label="Designation Status"
                            {...register('designation_status')}
                            isInvalid={!!errors.designation_status}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.designation_status?.message}
                        </Form.Control.Feedback>
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
