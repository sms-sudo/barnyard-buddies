import { Card, CardHeader, CardBody, CardFooter, Text, Divider, Button} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import TimeAgo from 'react-timeago';
import { useNavigate } from 'react-router-dom';


function NotificationCard({notification, onRemove, handleUpdate}) {
    const navigate = useNavigate();
    
    const handleCheck = (id, recipient_id) => {
        
        handleUpdate(id);
        navigate(`/pet_shelters/${localStorage.getItem('user_id')}`);
    }
    return(
        <>
            <Card variant='outline'>
            <CardHeader>
                Recieved <TimeAgo fontSize = "18px" style={{textAlign:'center'}} date={notification.time}/>
                {notification.isRead && <CheckIcon marginLeft={'20px'}/>}
            </CardHeader>
            <CardBody>
            <Text>{notification.message}</Text>
            <Text>{notification.id}</Text>
            </CardBody>
            
            <CardFooter>
            <div>
                <Button marginRight={'10px'} onClick={() => onRemove(notification.id)} colorScheme='teal' size='xs'>
                        Mark as Read
                </Button>
                <Button onClick={() => handleCheck(notification.id, notification.recipient_id)} colorScheme='teal' size='xs'>
                        Check Comment
                </Button>
            </div>
            </CardFooter>
            </Card>
            <Divider></Divider>
        </>
        )

}


export default NotificationCard;
