import React from 'react';
import Modal from './modal';
import Button from './button';


// TODO: generalize?

function WarningButton(props) {
  return <Button className='b shadow-1 shadow-hover-2 shadow-up-hover w-25' {...props} />;
}

function WarningModal(props) {
  return (
    <Modal title='Warning' maxWidth='80ch' maxHeight='90%' {...props}>
      <div className='ma3'>
        <p>Do you want to see the webhook example? <strong>(this will erase your previous input)</strong></p>

        <p className='f6'>
          You will not see this message again.
        </p>

        <div className='tc'>
          <WarningButton label='Yes' colors='white bg-dark-red' onClick={props.yes} />
          <WarningButton label='No' colors='white bg-green' onClick={props.no} />
        </div>
      </div> 
    </Modal>
  );
}


export default WarningModal;
