import { Box, Heading, ResponsiveContext, Text } from 'grommet'
import React, { useContext, Fragment } from 'react'

import PictureProfile from '../PictureProfile'
import Social from '../Social'
import { UserProfile } from '../../types'

const ProfileDescription: React.FC<UserProfile> = props => {
    const size = useContext(ResponsiveContext)
    const isMobile = size === 'small'

    const Biography = (
        <Box width="large">
            <Text size={isMobile ? 'small' : 'medium'}>{props.biography}</Text>
        </Box>
    )

    return (
        <Fragment>
            <Box direction="row" justify="start" margin={{ bottom: 'medium' }}>
                <Box
                    margin={{ right: 'large' }}
                    flex={false}
                    responsive={false}
                >
                    <PictureProfile size={size} imageUrl={props.pictureUrl} />
                </Box>
                <Box width="full">
                    <Box
                        direction="row-responsive"
                        align="center"
                        justify="between"
                    >
                        <Heading level={1} size="large">
                            {props.firstname}
                        </Heading>
                        <Social {...props.social} />
                    </Box>
                    {!isMobile && Biography}
                </Box>
            </Box>
            {isMobile && Biography}
        </Fragment>
    )
}

export default ProfileDescription
