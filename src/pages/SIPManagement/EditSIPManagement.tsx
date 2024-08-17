import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import url from '../../env';

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

const SIPEdit = () => {
    const { sipmember_id } = useParams<{ sipmember_id: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ISIPFormInput>();
    const [loading, setLoading] = useState(true);

    // Fetch existing SIP member data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url.nodeapipath}/sip/${sipmember_id}`);
                const data: ISIPFormInput = await response.json();

                // Pre-fill form with fetched data
                Object.keys(data).forEach(key => setValue(key as keyof ISIPFormInput, data[key as keyof ISIPFormInput]));

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch SIP member data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [sipmember_id, setValue]);

    // Handle form submission
    const onSubmit = async (formData: ISIPFormInput) => {
        try {
            const response = await fetch(`${url.nodeapipath}/sip/${sipmember_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('SIP registration updated successfully.');
                navigate('/path-to-redirect'); // Adjust path as needed
            } else {
                console.error('Failed to update SIP registration.');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Edit SIP Registration</Card.Title>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_name" className="form-label">Name</label>
                                            <input
                                                type="text"
                                                id="sipmember_name"
                                                className="form-control"
                                                placeholder="Enter Name"
                                                {...register('sipmember_name', { required: "Name is required" })}
                                            />
                                            {errors.sipmember_name && <div className="invalid-feedback d-block">{errors.sipmember_name.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="sipmember_bank_name" className="form-label">Bank Name</label>
                                            <input
                                                type="text"
                                                id="sipmember_bank_name"
                                                className="form-control"
                                                placeholder="Enter Bank Name"
                                                {...register('sipmember_bank_name', { required: "Bank Name is required" })}
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
                                                {...register('sipmember_account_number', { required: "Account Number is required" })}
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
                                                {...register('sipmember_ifsc_code', { required: "IFSC Code is required" })}
                                            />
                                            {errors.sipmember_ifsc_code && <div className="invalid-feedback d-block">{errors.sipmember_ifsc_code.message}</div>}
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
                                            <label htmlFor="sipmember_maturity_date" className="form-label">Maturity Date</label>
                                            <input
                                                type="date"
                                                id="sipmember_maturity_date"
                                                className="form-control"
                                                {...register('sipmember_maturity_date')}
                                            />
                                            {errors.sipmember_maturity_date && <div className="invalid-feedback d-block">{errors.sipmember_maturity_date.message}</div>}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_name" className="form-label">Nominee Name</label>
                                            <input
                                                type="text"
                                                id="sipmember_nominee_name"
                                                className="form-control"
                                                placeholder="Enter Nominee Name"
                                                {...register('sipmember_nominee_name', { required: "Nominee Name is required" })}
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
                                                {...register('sipmember_nominee_age', { required: "Nominee Age is required" })}
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
                                                {...register('sipmember_nominee_relation', { required: "Nominee Relation is required" })}
                                            />
                                            {errors.sipmember_nominee_relation && <div className="invalid-feedback d-block">{errors.sipmember_nominee_relation.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_mobile" className="form-label">Nominee Mobile</label>
                                            <input
                                                type="text"
                                                id="sipmember_nominee_mobile"
                                                className="form-control"
                                                placeholder="Enter Nominee Mobile"
                                                {...register('sipmember_nominee_mobile', { required: "Nominee Mobile is required" })}
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
                                            <select
                                                id="sipmemberblock_status"
                                                className="form-select"
                                                {...register('sipmemberblock_status')}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="Active">Active</option>
                                                <option value="Blocked">Blocked</option>
                                            </select>
                                            {errors.sipmemberblock_status && <div className="invalid-feedback d-block">{errors.sipmemberblock_status.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="branch_id" className="form-label">Branch</label>
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
                                </Row>
                                <Button variant="primary" type="submit">Update</Button>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SIPEdit;
