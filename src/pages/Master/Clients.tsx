import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table } from 'react-bootstrap';
import url from '../../env';  // Adjust the import path as necessary

// Define types
interface Client {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    postalAddress: string;
    landmark: string;
    aadharFile: string; // Assuming this is a URL or path
    panFile: string; // Assuming this is a URL or path
    createdAt: string; // Example date field
}

const columns = [
    { Header: 'Sr. No', accessor: 'srNo' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Mobile Number', accessor: 'mobile' },
    { Header: 'Postal Address', accessor: 'postalAddress' },
    { Header: 'Landmark', accessor: 'landmark' },
];

const Clients = () => {
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        fetch(`${url.nodeapipath}/clients`)
            .then((response) => response.json())
            .then((data: Client[]) => {
                // You can format data if needed
                const formattedData = data.map((client, index) => ({
                    srNo: index + 1,
                    ...client,
                }));
                setClients(formattedData);
            })
            .catch((error) => console.error('Error fetching client data:', error));
    }, []);

    return (
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                            <div>
                                <h4 className="header-title">Clients</h4>
                                <p className="text-muted font-14 mb-4">A table showing all clients</p>
                            </div>
                            <Button style={{ height: '40px', backgroundColor: '#dd4923' }}>
                                Add Client
                            </Button>
                        </div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {columns.map((column) => (
                                        <th key={column.Header}>{column.Header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map((client, index) => (
                                    <tr key={client._id}>
                                        {columns.map((column) => (
                                            <td key={column.accessor}>
                                                {column.accessor === 'aadharFile' || column.accessor === 'panFile' ? (
                                                    <a href={client[column.accessor as keyof Client]} target="_blank" rel="noopener noreferrer">
                                                        View File
                                                    </a>
                                                ) : (
                                                    client[column.accessor as keyof Client]
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Clients;
