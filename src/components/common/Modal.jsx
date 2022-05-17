import './modal.css'

import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

export default function Modal(props) {

    function closeModal(e) {
        const target = e.target.className
        const currentTarget = e.currentTarget.id
        if (target === 'common-modal-container' || currentTarget === 'modal-close') {
            props.closeModal(false)
        }
    }


    return <div className="common-modal-container" onClick={closeModal}>
        <div className={props.smallModal ? 'common-smallModal' : 'common-modal-content'}>
            <CloseIcon className='common-modal-closeIcon' id='modal-close' style={{ fontSize: '30' }} onClick={closeModal} />
            <main className={props.smallModal ? 'common-smallModal-info' : 'common-modal-info'}>
                <Typography variant="h6">{props.header}</Typography>
                <Typography variant="body2">{props.text}</Typography>
            </main>
        </div>
    </div>
}
