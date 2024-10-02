 import React from 'react';
 import Dialog from 'react-native-dialog';
 import { View } from 'react-native';

 interface CustomDialogProps {
   visible: boolean;
   title: string;
   message: string;
   onConfirm: () => void;
   onCancel?: () => void;
   showCancel?: boolean;
 }

const CustomDialog: React.FC<CustomDialogProps> = ({
     visible,
     title,
     message,
     onConfirm,
     onCancel,
     showCancel = true,
   }) => {
     return (
       <Dialog.Container visible={visible}>
         <Dialog.Title>{title}</Dialog.Title>
         <Dialog.Description>{message}</Dialog.Description>
         {showCancel && <Dialog.Button label='Cancel' onPress={onCancel || (() => {})} />}
         <Dialog.Button label='OK' onPress={onConfirm} />
       </Dialog.Container>
     );
   };
 export default CustomDialog;
