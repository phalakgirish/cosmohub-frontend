import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';

// Define the type for form data
type SIPSlabData = {
    duration: [number, number];
    amount: string;
    type: string;
    sip_status: string;
};

// Validation schema
const schemaResolver = yupResolver(
    yup.object().shape({
        duration: yup.array().of(
            yup.number()
                .required('Please enter the duration in years')
                .max(40, 'Duration cannot be more than 40 years')
        ).length(2),
        amount: yup.string().required('Please enter the amount'),
        type: yup.string().required('Please select the type'),
        sip_status: yup.string().required('Please select the SIP status'),
    })
);

const AddSIPSlab = () => {
    const { handleSubmit, control, formState: { errors } } = useForm<SIPSlabData>({
        resolver: schemaResolver,
    });

    const [duration, setDuration] = useState<[number, number]>([1, 40]);

    const onSubmit = async (formData: SIPSlabData) => {
        console.log(formData);
        // Handle form submission
    };

    return (
        <Card>
            <Card.Body>
                <h4 className="header-title mt-0 mb-1">Add SIP Slab</h4>
                <p className="sub-header">Fill the form to add a new SIP slab.</p>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-2">
                        <Form.Label>Duration (in months): {duration[0]} - {duration[1]}</Form.Label>
                        <Controller
                            name="duration"
                            control={control}
                            render={({ field }) => (
                                <Nouislider
                                    range={{ min: 1, max: 40 }}
                                    start={duration}
                                    step={1}
                                    connect
                                    onSlide={(render, handle, value) => {
                                        const roundedValues = value.map(val => Math.round(val));
                                        setDuration([roundedValues[0], roundedValues[1]]);
                                        field.onChange([roundedValues[0], roundedValues[1]]);
                                    }}
                                />
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.duration && (errors.duration[0]?.message || errors.duration[1]?.message)}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Amount</Form.Label>
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <Form.Control
                                    type="number"
                                    placeholder="Enter amount"
                                    {...field}
                                    isInvalid={!!errors.amount}
                                />
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.amount?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Type</Form.Label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Form.Select {...field} isInvalid={!!errors.type}>
                                    <option value="">Select type</option>
                                    <option value="Slab">Slab</option>
                                    <option value="Fix">Fix</option>
                                </Form.Select>
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.type?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>SIP Status</Form.Label>
                        <Controller
                            name="sip_status"
                            control={control}
                            render={({ field }) => (
                                <Form.Select {...field} isInvalid={!!errors.sip_status}>
                                    <option value="">Select status</option>
                                    <option value="Continue">Continue</option>
                                    <option value="Discontinue">Discontinue</option>
                                </Form.Select>
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.sip_status?.message}
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

const SIPSlab = () => {
    return (
        <Row>
            <Col lg={12}>
                <AddSIPSlab />
            </Col>
        </Row>
    );
};

export default SIPSlab;
