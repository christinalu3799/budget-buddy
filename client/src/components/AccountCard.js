import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

const MyVerticallyCenteredModal = (props) => {
    const { accountName, ...otherProps } = props;
    return (
        <Modal
            // https://stackoverflow.com/questions/74881085/how-to-fix-this-warning-in-reactjs-warning-react-does-not-recognize-the-showl
            {...otherProps}
            size='lg'
            aria-labelledby='contained-modal-title-vcenter'
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'>
                    {props.accountName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>TEST</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={otherProps.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

const AccountCard = ({ accountName, accountPreviewText }) => {
    const [modalShow, setModalShow] = useState(false);

    const navigate = useNavigate();

    const handleNavigateToTransactions = () => {
        navigate('/transactions', { state: { accountName } });
    };
    return (
        <>
            <Card
                style={{ width: '24rem' }}
                className='mt-4 mb-4'
                onClick={handleNavigateToTransactions}
                role='button'
            >
                <Card.Body>
                    <Card.Title>{accountName}</Card.Title>
                    <Card.Text>
                        Starting Balance: {accountPreviewText}
                    </Card.Text>
                </Card.Body>
            </Card>

            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                accountName={accountName}
            />
        </>
    );
};

export default AccountCard;
