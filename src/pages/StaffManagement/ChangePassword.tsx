import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Row, Col, Container, Card, Button } from 'react-bootstrap';
import url from '../../env';
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


interface IFormInput {
    oldpassword: string;
    newpassword: string;
    confirmpassword: string;
}


const ChangePassword = () => {
    const [staffPancard, setStaffPancard] = useState({});
    const [staffAadharcard, setStaffAadharcard] = useState({});
    const[aadharFileStatus,setAadharFileStatus] = useState(false);
    const[panFileStatus,setPanFileStatus] = useState(false);
    const navigate = useNavigate();
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const userData:any = JSON.parse(StorageuserData);

    const[errFile,setErrFile] = useState(false);
    const[fileName,setFileName] = useState('')

    usePageTitle({
        title: 'Add Staff',
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

    const schema = yup.object().shape({
        oldpassword: yup.string().required('Please enter old password'),
        newpassword: yup.string().required('Please enter new password'),
        confirmpassword: yup.string().required('Please enter confirm password'),
    });


    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: IFormInput) => {

            // console.log(data);
            
            const dataToPost = {
                user_oldpassword:data.oldpassword,
                user_newpassword:data.newpassword,
                user_confirmpassword:data.confirmpassword
            }

            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/users/passwordchange/${userData._id}`, {
                    body: JSON.stringify(dataToPost),
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    },
                    
                });
                const result = await response.json();
                if(response.ok)
                {
                    // console.log('Registration successful:', result);
                    toast.success( result.message || 'Password changed successfully');
                    navigate('/dashboard')
                }
                else
                {
                    toast.error(result.message || 'Failed to add Staff.');
                }
                
            } catch (error) {
                // console.error('Error during registration:', error);
                toast.error(`Error during registration:${error}`);

            }
        
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col>
                    <Card className="mt-4">
                        <Card.Body>
                        <h4 className="header-title mt-0 mb-1">Add Staff</h4>
                        <p className="sub-header">Fill the form to add a new Staff.</p>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label htmlFor="oldpassword" className="form-label">Old Password</label>
                                            <input
                                                type="password"
                                                id="oldpassword"
                                                placeholder="Enter Old Password"
                                                className="form-control"
                                                {...register('oldpassword')}
                                            />
                                            {errors.oldpassword && <div className="invalid-feedback d-block">{errors.oldpassword.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="newpassword" className="form-label">New Password</label>
                                            <input
                                                type="password"
                                                id="newpassword"
                                                placeholder="Enter New Password"
                                                className="form-control"
                                                {...register('newpassword')}
                                            />
                                             {errors.newpassword && <div className="invalid-feedback d-block">{errors.newpassword.message}</div>} 
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="confirmpassword" className="form-label">Confirm Password</label>
                                            <input
                                                type="password"
                                                id="confirmpassword"
                                                placeholder="Enter Confirm Password"
                                                className="form-control"
                                                {...register('confirmpassword')}
                                            />
                                            {errors.confirmpassword && <div className="invalid-feedback d-block">{errors.confirmpassword.message}</div>}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                    </Col>
                                </Row>

                                <div className="text-md-end mb-0">
                                    <Button variant="primary" className="me-1" type="submit">
                                        Change Password
                                    </Button>
                                    <Button variant="secondary" type="reset">
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ChangePassword;