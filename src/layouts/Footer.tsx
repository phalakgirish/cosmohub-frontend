import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <Container fluid>
                <Row>
                    <Col md={6}>
                        {new Date().getFullYear()} &copy; CosmoHub by <Link to="#">PSoft Solutions</Link>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
