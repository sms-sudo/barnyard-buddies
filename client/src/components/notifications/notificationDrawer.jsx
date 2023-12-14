
import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, DrawerFooter, Button ,VStack  } from '@chakra-ui/react';
import NotificationCard from './notificationCard';
import React, {useState, useEffect} from 'react';
import { TriangleDownIcon, TriangleUpIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';


function NotificationDrawer({ isOpen, onClose , notificationList}) {
    const [notifications, setNotifications] = useState(notificationList); 
    const [sortedFilteredNotifications, setSortedFilteredNotifications] = useState(notifications);
    const [sortAscending, setSortAscending] = useState(true);
    const [filterRead, setFilterRead] = useState(false);

    useEffect(() => {
        let processedNotifications = [...notifications];

        // Sort notifications by date
        processedNotifications.sort((a, b) => {
            return sortAscending
                ? new Date(a.time) - new Date(b.time) // Ascending order
                : new Date(b.time) - new Date(a.time); // Descending order
        });

        // Filter notifications by read status
        if (filterRead) {
            processedNotifications = processedNotifications.filter(notification => !notification.isRead);
        }

        setSortedFilteredNotifications(processedNotifications);
    }, [notifications, sortAscending, filterRead]);

    const toggleSortOrder = () => {
        setSortAscending(!sortAscending);
    };

    const toggleFilter = () => {
        setFilterRead(!filterRead);
    };



    useEffect(() => {
        setNotifications(notificationList);
    }, [notificationList]);

    const removeNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
        handleUpdate(id)
    };

    const handleUpdate = async (id) => {
        const queryString = `http://127.0.0.1:8000/notifications/${id}/`;
    
        try {
            const accessToken = localStorage.getItem('access_token');
            await axios.patch(queryString, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            console.log(`Pet listing with ID ${id} updated successfully`);
            // You might want to update the UI or redirect the user
        } catch (error) {
            console.error('Error updating pet listing:', error);
            // Handle any errors, such as displaying a message to the user
        }
    };
    

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onClose}
      size={'md'}
    colorScheme={'blue'}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth='1px'>My Notifications
        <div>
          <Button rightIcon={sortAscending ? <TriangleUpIcon /> : <TriangleDownIcon />} onClick={toggleSortOrder} marginTop={'8px'}>
                Sort by date
          </Button>

          <Button rightIcon={filterRead ? <ViewOffIcon /> : <ViewIcon />} onClick={toggleFilter} marginTop={'8px'} marginLeft={'10px'}>
                Show Unread Only
          </Button>
        </div>
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing={4}>
          {sortedFilteredNotifications.map(notification => (
                <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onRemove={removeNotification}
                    handleUpdate={handleUpdate}
                />
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default NotificationDrawer;
