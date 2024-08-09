import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Define the type for form data
type ClientRegistrationData = {
    name: string;
    email: string;
    mobile: string;
    postalAddress: string;
    landmark: string;
    aadharFile: FileList;
    panFile: FileList;
};

// Validation schema
const schemaResolver = yupResolver(
    yup.object().shape({
        name: yup.string().required('Please enter your name'),
        email: yup.string().email('Invalid email format').required('Please enter your email'),
        mobile: yup.string().required('Please enter your mobile number'),
        postalAddress: yup.string().required('Please enter your postal address'),
        landmark: yup.string().required('Please enter a landmark'),
        aadharFile: yup.mixed().required('Please upload your Aadhar card'),
        panFile: yup.mixed().required('Please upload your PAN card'),
    })
);

const ClientRegistration = () => {
    const { handleSubmit, control, formState: { errors }, setValue } = useForm<ClientRegistrationData>({
        resolver: schemaResolver,
    });

    const onSubmit = async (formData: ClientRegistrationData) => {
        console.log(formData);
        // Handle form submission
    };

    // Handle file input change manually
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ClientRegistrationData) => {
        const files = event.target.files;
        if (files) {
            setValue(fieldName, files);
        }
    };

    return (
        <Card>
            <Card.Body>
                <h4 className="header-title mt-0 mb-1">Client Registration</h4>
                <p className="sub-header">Fill the form to register a new client.</p>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your name"
                                            {...field}
                                            isInvalid={!!errors.name}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            {...field}
                                            isInvalid={!!errors.email}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Mobile Number</Form.Label>
                                <Controller
                                    name="mobile"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your mobile number"
                                            {...field}
                                            isInvalid={!!errors.mobile}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.mobile?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Postal Address</Form.Label>
                                <Controller
                                    name="postalAddress"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your postal address"
                                            {...field}
                                            isInvalid={!!errors.postalAddress}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.postalAddress?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Landmark</Form.Label>
                                <Controller
                                    name="landmark"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter a landmark"
                                            {...field}
                                            isInvalid={!!errors.landmark}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.landmark?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Aadhar Card Upload</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(event) => handleFileChange(event as React.ChangeEvent<HTMLInputElement>, 'aadharFile')}
                                    isInvalid={!!errors.aadharFile}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.aadharFile?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>PAN Card Upload</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(event) => handleFileChange(event as React.ChangeEvent<HTMLInputElement>, 'panFile')}
                                    isInvalid={!!errors.panFile}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.panFile?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

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

export default ClientRegistration;
