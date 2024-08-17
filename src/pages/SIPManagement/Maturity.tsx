import { useState } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// hooks
import { usePageTitle } from '../../hooks';

// Define types
type MaturityData = {
    customerId: string;
    sipMemberCode: string;
    name: string;
    paidAmount: number;
    paidBy: string;
    paymentMode: string;
    document: File | null;
};

// Validation schema
const schema = yup.object().shape({
    customerId: yup.string().required('Customer ID is required'),
    sipMemberCode: yup.string().required('SIP Member Code is required'),
    name: yup.string().required('Name is required'),
    paidAmount: yup.number().required('Paid Amount is required').positive('Amount must be positive'),
    paidBy: yup.string().required('Paid By is required'),
    paymentMode: yup.string().required('Payment Mode is required'),
    document: yup.mixed().required('Document upload is required'),
});

const MaturityForm = () => {
    const { control, handleSubmit, reset } = useForm<MaturityData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (formData: MaturityData) => {
        console.log('Form data:', formData);
        // Handle form submission (e.g., API call, etc.)
    };

    return (
        <Card>
            <Card.Body>
                <h4 className="header-title mt-0 mb-1">Maturity Details</h4>
                <p className="sub-header">Fill in the details for maturity processing.</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Customer ID</Form.Label>
                                <Controller
                                    name="customerId"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter Customer ID" />}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>SIP Member Code</Form.Label>
                                <Controller
                                    name="sipMemberCode"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter SIP Member Code" />}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Name</Form.Label>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter Name" />}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Paid Amount</Form.Label>
                                <Controller
                                    name="paidAmount"
                                    control={control}
                                    render={({ field }) => <Form.Control type="number" {...field} placeholder="Enter Paid Amount" />}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Paid By</Form.Label>
                                <Controller
                                    name="paidBy"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter Paid By" />}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Payment Mode</Form.Label>
                                <Controller
                                    name="paymentMode"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select {...field}>
                                            <option value="">Select Payment Mode</option>
                                            <option value="cash">Cash</option>
                                            <option value="cheque">Cheque</option>
                                            <option value="online">Online</option>
                                        </Form.Select>
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Upload Document</Form.Label>
                                <Controller
                                    name="document"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="file"
                                            // onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                        />
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
                            Reset
                        </Button>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
};

const Maturity = () => {
    usePageTitle({
        title: 'Maturity',
        breadCrumbItems: [
            {
                path: '/forms/maturity',
                label: 'Forms',
            },
            {
                path: '/forms/maturity',
                label: 'Maturity',
                active: true,
            },
        ],
    });

    return (
        <>
            <Row style={{ marginTop: '25px' }}>
                <Col lg={12}>
                    <MaturityForm />
                </Col>
            </Row>
        </>
    );
};

export default Maturity;
