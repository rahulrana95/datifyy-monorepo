import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Text, useDisclosure } from "@chakra-ui/react";

interface ConfirmModalProps {
    onConfirm: () => void; // Callback for confirming action
    title?: string; // Modal title
    message?: string; // Confirmation message
    buttonText?: string; // Default button text
    colorScheme?: string; // Button color (default: "red")
    bg?: string; // Button background color (default: "accent.400")
    variant?: string; // Button variant (default: "solid")
    _hover?: any; // Button hover styles
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    buttonText = "Delete",
    colorScheme = "red",
    bg = "accent.400",
    variant = "solid",
    _hover = { bg: "accent.700" }
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {/* Trigger Button */}
            <Button size="sm" colorScheme={colorScheme} onClick={onOpen} variant={variant} bg={bg} _hover={_hover}>
                {buttonText}
            </Button>

            {/* Confirmation Modal */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>{message}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme={colorScheme} onClick={() => { onConfirm(); onClose(); }}>
                            Confirm
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ConfirmModal;
