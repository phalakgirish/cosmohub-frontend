import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import url from '../../env';
// hooks
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from 'react-router-dom';

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

const BasicForm = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch branches from the backend
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
    }, []);

    /*
    form validation schema
    */
    const schemaResolver = yupResolver(
        yup.object().shape({
            department_name: yup.string().required('Please enter Department Name'),
            branch_name: yup.string().required('Please select a Branch'),
            department_status: yup.bool().required('Please select Department Status'),
        })
    );

    const { handleSubmit, register, formState: { errors } } = useForm<DepartmentData>({
        resolver: schemaResolver,
    });

    const onSubmit = async (formData: DepartmentData) => {
        try {
            console.log(formData);
            
            const bearerToken = secureLocalStorage.getItem('login');

            const response = await fetch(`${url.nodeapipath}/department/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log(result);

            if (response.ok) {
                console.log('Department added successfully:', result);
                navigate('/department')
            } else {
                console.error('Error adding department:', result);
            }
        } catch (error) {
            console.error('Error during API call:', error);
        }
    };

    return (
        <Card>
            <Card.Body>
                <h4 className="header-title mt-0 mb-1">Add Department</h4>
                <p className="sub-header">Fill the form to add a new department.</p>
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

const AddDepartment = () => {
    usePageTitle({
        title: 'Add Department',
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

export default AddDepartment;
