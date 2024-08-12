import { useState } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import url from '../../env';
// hooks
import { usePageTitle } from '../../hooks';

// components
import { FormInput, VerticalForm } from '../../components/form';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from 'react-router-dom';

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
    branch_state: string;
    branch_status: boolean;
};



const BasicForm = () => {

    const schemaResolver = yupResolver(
        yup.object().shape({
            branch_name: yup.string().required('Please enter Branch name'),
            branch_contact_person: yup.string().required('Please enter Contact Person'),
            branch_mobile_number: yup.string().required('Please enter Mobile Number'),
            branch_emailId: yup.string().required('Please enter Email address').email('Please enter a valid Email address'),
            branch_area: yup.string().required('Please enter Area'),
            branch_city: yup.string().required('Please enter City'),
            branch_district: yup.string().required('Please enter District'),
            branch_taluka: yup.string().required('Please enter Taluka'),
            branch_pincode: yup.string().required('Please enter Pincode'),
            branch_state: yup.string().required('Please enter state'),
            branch_status: yup.boolean().required('Please select Status'),
        })
    );

    const { control, handleSubmit, reset,formState:{ errors} } = useForm<BranchData>({
        resolver: schemaResolver,
        defaultValues: {
            branch_status: true, // Default value if needed
        },
    });

    const navigate = useNavigate();

    const onSubmit = async (formData: BranchData) => {
        try {
            const bearerToken = secureLocalStorage.getItem('login');
            const response = await fetch(`${url.nodeapipath}/branch/`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Branch added successfully:', result);
                navigate('/branch');
                // reset(); // Reset form fields on successful submission
            } else {
                console.error('Error adding branch:', result);
                // Optionally, handle error (e.g., show an error message)
            }
        } catch (error) {
            console.error('Error during API call:', error);
            // Optionally, handle error (e.g., show an error message)
        }
    };

    return (
        <Card>
            <Card.Body>
                <h4 className="header-title mt-0 mb-1">Add Branch</h4>
                <p className="sub-header">Fill the form to add a new branch.</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Branch Name</Form.Label>
                                <Controller
                                    name="branch_name"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter Branch name" />}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Contact Person</Form.Label>
                                <Controller
                                    name="branch_contact_person"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter contact person name" />}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Mobile Number</Form.Label>
                                <Controller
                                    name="branch_mobile_number"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter mobile number" />}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Email Address</Form.Label>
                                <Controller
                                    name="branch_emailId"
                                    control={control}
                                    render={({ field }) => <Form.Control type="email" {...field} placeholder="Enter email address" />}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Area</Form.Label>
                                <Controller
                                    name="branch_area"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter area" />}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>City</Form.Label>
                                <Controller
                                    name="branch_city"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter city" />}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>District</Form.Label>
                                <Controller
                                    name="branch_district"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter district" />}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Taluka</Form.Label>
                                <Controller
                                    name="branch_taluka"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter taluka" />}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Pincode</Form.Label>
                                <Controller
                                    name="branch_pincode"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter pincode" />}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>State</Form.Label>
                                <Controller
                                    name="branch_state"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter state" />}
                                />
                            </Form.Group>
                        </Col>
                        </Row>
                        <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Status</Form.Label>
                                <Controller
                                    name="branch_status"
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
                        </Col>
                    </Row>

                    <div className="text-md-end mb-0">
                        <Button variant="primary" className="me-1" type="submit">
                            Submit
                        </Button>
                        <Button variant="secondary" type="button" onClick={() => reset()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
};

const AddBranch = () => {
    usePageTitle({
        title: 'Add Branch',
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
        <>
            <Row style={{marginTop:'25px'}}>
                <Col lg={12}>
                    <BasicForm />
                </Col>
            </Row>
        </>
    );
};

export default AddBranch;
