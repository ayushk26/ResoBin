import { ChatAlt, DocumentText } from '@styled-icons/heroicons-outline'
import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { CourseContentRequestIcon } from 'components/CoursePage/CourseContentRequest'
import FavoriteToggle from 'components/Favourites/FavoriteToggle'
import { CardSplit, Divider, Tag, Typography } from 'components/shared'
import { ButtonSquareLink } from 'components/shared/Buttons'
import { TimetableSelector } from 'components/Timetable'
import { hash } from 'helpers'
import { coursePageUrl } from 'helpers/format'
import { useColorPicker, useResponsive } from 'hooks'
import { device, fontSize } from 'styles/responsive'

// TODO: Add highlight for description
const HighlightMatches = ({ content }) => {
  const location = useLocation()
  const queryString = new URLSearchParams(location.search)
  const search = (queryString.get('q') || '').toLowerCase()
  const re = new RegExp(`(${search})`, 'gi')

  return content
    .split(re)
    .map((part, index) =>
      part.toLowerCase() === search ? (
        <Mark key={String(index)}>{part}</Mark>
      ) : (
        <Fragment key={String(index)}>{part}</Fragment>
      )
    )
}

const CourseItemMain = ({ courseData }) => {
  const colorPicker = useColorPicker()
  const {
    code,
    credits,
    department,
    title,
    description,
    tags,
    favoritedByCount,
  } = courseData

  const creditColorPicker = (_credits) => {
    if (_credits >= 10) return colorPicker(0)
    if (_credits >= 8) return colorPicker(1)
    if (_credits >= 6) return colorPicker(2)
    if (_credits >= 4) return colorPicker(3)
    if (_credits >= 2) return colorPicker(4)
    return colorPicker(5)
  }

  return (
    <>
      <SubTitle>
        <DepartmentContainer
          style={{ color: colorPicker(hash(department.name)) }}
        >
          {department.name}
        </DepartmentContainer>

        <RightIcons>
          <TagsContainer>
            {credits > 0 && (
              <Tag style={{ color: creditColorPicker(credits) }}>
                {credits} credit{credits > 1 ? 's' : ''}
              </Tag>
            )}

            {tags.map((tag) => (
              <Tag key={tag} style={{ color: colorPicker(hash(tag)) }}>
                {tag}
              </Tag>
            ))}
          </TagsContainer>

          <FavoriteToggle code={code} initialCount={favoritedByCount} />
        </RightIcons>
      </SubTitle>

      <TitleContainer to={coursePageUrl(code, title)}>
        <h1>
          <HighlightMatches content={code} />
        </h1>

        <h2>
          <HighlightMatches content={title} />
        </h2>
      </TitleContainer>

      <Typography.Paragraph
        ellipsis={{ rows: 3, expandable: true, symbol: 'show more' }}
        style={{ marginTop: '0.75rem', marginBottom: 0 }}
      >
        {description?.length ? description : 'No description available'}
      </Typography.Paragraph>
    </>
  )
}

// TODO: Improve responsiveness
const CourseItemSub = ({ courseData }) => {
  const { isMobile, isMobileS } = useResponsive()

  const {
    code,
    title,
    semester,
    reviewsCount,
    resourcesCount,
    reviewRequestersCount,
    resourceRequestersCount,
  } = courseData

  return (
    <>
      <TimetableSelector semester={semester} />

      {(isMobileS || !isMobile) && <Divider margin="0.75rem 0" />}
      {isMobile && !isMobileS && (
        <Divider style={{ width: '1px' }} type="vertical" />
      )}

      <div>
        <FlexGap style={{ marginBottom: '0.75rem' }}>
          <ButtonSquareLink
            to={`${coursePageUrl(code, title)}#reviews`}
            style={{ width: '100%', borderRadius: '0.5rem 0 0 0.5rem' }}
          >
            <ChatAlt size="16" />
            Reviews {reviewsCount > 0 && `(${reviewsCount})`}
          </ButtonSquareLink>

          <CourseContentRequestIcon
            code={code}
            type="reviews"
            initialCount={reviewRequestersCount}
            tooltip="Request reviews"
          />
        </FlexGap>

        <FlexGap>
          <ButtonSquareLink
            style={{ width: '100%', borderRadius: '0.5rem 0 0 0.5rem' }}
            to={`${coursePageUrl(code, title)}#resources`}
          >
            <DocumentText size="16" />
            Resources {resourcesCount > 0 && `(${resourcesCount})`}
          </ButtonSquareLink>

          <CourseContentRequestIcon
            code={code}
            type="resources"
            initialCount={resourceRequestersCount}
            tooltip="Request resources"
          />
        </FlexGap>
      </div>
    </>
  )
}

const CourseItem = ({ courseData }) => {
  return (
    <CardSplit
      main={<CourseItemMain courseData={courseData} />}
      sub={<CourseItemSub courseData={courseData} />}
      subWidth="13rem"
    />
  )
}

export default CourseItem

const TitleContainer = styled(Link)`
  display: flex;
  gap: 0.375rem;
  align-items: baseline;
  color: ${({ theme }) => theme.textColor};

  h1 {
    font-weight: 600;
    font-size: ${fontSize.responsive.xl};
  }

  h2 {
    font-weight: 400;
    font-size: ${fontSize.responsive.md};
  }

  &:hover {
    color: ${({ theme }) => theme.textColor};
    text-decoration: underline;
  }
`

const Mark = styled.mark`
  padding: 0;
  color: ${({ theme }) => theme.secondary};
  background: ${({ theme }) => theme.primary};
`

const SubTitle = styled.div`
  display: flex;
  align-items: center;
  height: 2rem;
  margin-bottom: 0.5rem;

  @media ${device.max.xs}, ${device.min.lg} and ${device.max.xl} {
    height: 3rem;
  }
`

const DepartmentContainer = styled.span`
  width: 100%;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  font-size: ${fontSize.responsive.xs};
  opacity: 0.85;

  @media ${device.min.md} {
    font-weight: 500;
  }
`

const RightIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const TagsContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  gap: 0.25rem;
  align-items: center;
  height: 3rem;
  margin-left: 0.5rem;
  overflow-y: scroll;

  @media ${device.max.xs}, ${device.min.lg} and ${device.max.xl} {
    display: block;
    max-width: 6rem;

    > :not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }
`

const FlexGap = styled.div`
  display: flex;
  gap: 0.25rem;
  width: 100%;
`
