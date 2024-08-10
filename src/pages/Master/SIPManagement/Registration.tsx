import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import url from '../../../env';

interface ISIPFormInput {
    sipmember_id: string;
    client_id: string;
    sipmember_name: string;
    sipmember_bank_name: string;
    sipmember_account_number: string;
    sipmember_ifsc_code: string;
    sipmember_upi_id: string;
    sipmember_doj: string;
    sipmember_maturity_date: string;
    sipmember_nominee_name: string;
    sipmember_nominee_age: string;
    sipmember_nominee_relation: string;
    sipmember_nominee_mobile: string;
    sipmember_nominee_pancard: string;
    sipmember_nominee_addharcard: string;
    sipmemberblock_status: string;
    branch_id: string;
}

const schema = yup.object().shape({
    sipmember_id: yup.string().required('Member ID is required'),
    sipmember_name: yup.string().required('Member Name is required'),
    client_id: yup.string().required('Client ID is required'),
    sipmember_bank_name: yup.string().required('Bank Name is required'),
    sipmember_account_number: yup.string().required('Account Number is required'),
    sipmember_ifsc_code: yup.string().required('IFSC Code is required'),
    sipmember_upi_id: yup.string().required('UPI ID is required'),
    sipmember_doj: yup.date().required('Date of Joining is required'),
    sipmember_maturity_date: yup.date().required('Maturity Date is required'),
    sipmember_nominee_name: yup.string().required('Nominee Name is required'),
    sipmember_nominee_age: yup.string().required('Nominee Age is required'),
    sipmember_nominee_relation: yup.string().required('Nominee Relation is required'),
    sipmember_nominee_mobile: yup.string().required('Nominee Mobile Number is required'),
    sipmember_nominee_pancard: yup.string().required('Nominee PAN Card is required'),
    sipmember_nominee_addharcard: yup.string().required('Nominee Aadhar Card is required'),
    sipmemberblock_status: yup.string().required('Block Status is required'),
    branch_id: yup.string().required('Branch ID is required'),
});

const SIPRegistration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ISIPFormInput>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: ISIPFormInput) => {
        try {
            const response = await fetch(`${url.nodeapipath}/sip/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log('Registration successful:', result);
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center">SIP Registration</Card.Title>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_id" className="form-label">Member ID</label>
                                            <input
                                                type="text"
                                                id="sipmember_id"
                                                className="form-control"
                                                placeholder="Enter Member ID"
                                                {...register('sipmember_id')}
                                            />
                                            {errors.sipmember_id && <div className="invalid-feedback d-block">{errors.sipmember_id.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="sipmember_name" className="form-label">Member Name</label>
                                            <input
                                                type="text"
                                                id="sipmember_name"
                                                className="form-control"
                                                placeholder="Enter Member Name"
                                                {...register('sipmember_name')}
                                            />
                                            {errors.sipmember_name && <div className="invalid-feedback d-block">{errors.sipmember_name.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="client_id" className="form-label">Client ID</label>
                                            <input
                                                type="text"
                                                id="client_id"
                                                className="form-control"
                                                placeholder="Enter Client ID"
                                                {...register('client_id')}
                                            />
                                            {errors.client_id && <div className="invalid-feedback d-block">{errors.client_id.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_upi_id" className="form-label">UPI ID</label>
                                            <input
                                                type="text"
                                                id="sipmember_upi_id"
                                                className="form-control"
                                                placeholder="Enter UPI ID"
                                                {...register('sipmember_upi_id')}
                                            />
                                            {errors.sipmember_upi_id && <div className="invalid-feedback d-block">{errors.sipmember_upi_id.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="sipmember_doj" className="form-label">Date of Joining</label>
                                            <input
                                                type="date"
                                                id="sipmember_doj"
                                                className="form-control"
                                                {...register('sipmember_doj')}
                                            />
                                            {errors.sipmember_doj && <div className="invalid-feedback d-block">{errors.sipmember_doj.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_bank_name" className="form-label">Bank Name</label>
                                            <input
                                                type="text"
                                                id="sipmember_bank_name"
                                                className="form-control"
                                                placeholder="Enter Bank Name"
                                                {...register('sipmember_bank_name')}
                                            />
                                            {errors.sipmember_bank_name && <div className="invalid-feedback d-block">{errors.sipmember_bank_name.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="sipmember_account_number" className="form-label">Account Number</label>
                                            <input
                                                type="text"
                                                id="sipmember_account_number"
                                                className="form-control"
                                                placeholder="Enter Account Number"
                                                {...register('sipmember_account_number')}
                                            />
                                            {errors.sipmember_account_number && <div className="invalid-feedback d-block">{errors.sipmember_account_number.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="sipmember_ifsc_code" className="form-label">IFSC Code</label>
                                            <input
                                                type="text"
                                                id="sipmember_ifsc_code"
                                                className="form-control"
                                                placeholder="Enter IFSC Code"
                                                {...register('sipmember_ifsc_code')}
                                            />
                                            {errors.sipmember_ifsc_code && <div className="invalid-feedback d-block">{errors.sipmember_ifsc_code.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="branch_id" className="form-label">Branch ID</label>
                                            <input
                                                type="text"
                                                id="branch_id"
                                                className="form-control"
                                                placeholder="Enter Branch ID"
                                                {...register('branch_id')}
                                            />
                                            {errors.branch_id && <div className="invalid-feedback d-block">{errors.branch_id.message}</div>}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                       

                                        <div className="mb-3">
                                            <label htmlFor="sipmember_maturity_date" className="form-label">Maturity Date</label>
                                            <input
                                                type="date"
                                                id="sipmember_maturity_date"
                                                className="form-control"
                                                {...register('sipmember_maturity_date')}
                                            />
                                            {errors.sipmember_maturity_date && <div className="invalid-feedback d-block">{errors.sipmember_maturity_date.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_name" className="form-label">Nominee Name</label>
                                            <input
                                                type="text"
                                                id="sipmember_nominee_name"
                                                className="form-control"
                                                placeholder="Enter Nominee Name"
                                                {...register('sipmember_nominee_name')}
                                            />
                                            {errors.sipmember_nominee_name && <div className="invalid-feedback d-block">{errors.sipmember_nominee_name.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_age" className="form-label">Nominee Age</label>
                                            <input
                                                type="text"
                                                id="sipmember_nominee_age"
                                                className="form-control"
                                                placeholder="Enter Nominee Age"
                                                {...register('sipmember_nominee_age')}
                                            />
                                            {errors.sipmember_nominee_age && <div className="invalid-feedback d-block">{errors.sipmember_nominee_age.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_relation" className="form-label">Nominee Relation</label>
                                            <input
                                                type="text"
                                                id="sipmember_nominee_relation"
                                                className="form-control"
                                                placeholder="Enter Nominee Relation"
                                                {...register('sipmember_nominee_relation')}
                                            />
                                            {errors.sipmember_nominee_relation && <div className="invalid-feedback d-block">{errors.sipmember_nominee_relation.message}</div>}
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_mobile" className="form-label">Nominee Mobile Number</label>
                                            <input
                                                type="text"
                                                id="sipmember_nominee_mobile"
                                                className="form-control"
                                                placeholder="Enter Nominee Mobile Number"
                                                {...register('sipmember_nominee_mobile')}
                                            />
                                            {errors.sipmember_nominee_mobile && <div className="invalid-feedback d-block">{errors.sipmember_nominee_mobile.message}</div>}
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_pancard" className="form-label">Nominee PAN Card</label>
                                            <input
                                                type="text"
                                                id="sipmember_nominee_pancard"
                                                className="form-control"
                                                placeholder="Enter Nominee PAN Card"
                                                {...register('sipmember_nominee_pancard')}
                                            />
                                            {errors.sipmember_nominee_pancard && <div className="invalid-feedback d-block">{errors.sipmember_nominee_pancard.message}</div>}
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_addharcard" className="form-label">Nominee Aadhar Card</label>
                                            <input
                                                type="text"
                                                id="sipmember_nominee_addharcard"
                                                className="form-control"
                                                placeholder="Enter Nominee Aadhar Card"
                                                {...register('sipmember_nominee_addharcard')}
                                            />
                                            {errors.sipmember_nominee_addharcard && <div className="invalid-feedback d-block">{errors.sipmember_nominee_addharcard.message}</div>}
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label htmlFor="sipmemberblock_status" className="form-label">Block Status</label>
                                            <input
                                                type="text"
                                                id="sipmemberblock_status"
                                                className="form-control"
                                                placeholder="Enter Block Status"
                                                {...register('sipmemberblock_status')}
                                            />
                                            {errors.sipmemberblock_status && <div className="invalid-feedback d-block">{errors.sipmemberblock_status.message}</div>}
                                        </div>
                                        
                                       
                                    </Col>
                                </Row>
                                <Button variant="primary" type="submit">Register</Button>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SIPRegistration;
