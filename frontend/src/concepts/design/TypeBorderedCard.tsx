import * as React from 'react';
import { css } from '@patternfly/react-styles';
import { Card, CardProps } from '@patternfly/react-core';
import { ProjectObjectType, SectionType } from '#~/concepts/design/utils';

import './TypeBorderCard.scss';

type TypeBorderedCardProps = CardProps & {
  objectType?: ProjectObjectType;
  sectionType?: SectionType;
  selectable?: boolean;
  selected?: boolean;
};
const TypeBorderedCard: React.FC<TypeBorderedCardProps> = ({
  objectType,
  sectionType,
  className,
  selectable,
  selected,
  ...rest
}) => (
  <Card
    className={css(
      className,
      'odh-type-bordered-card',
      sectionType,
      objectType,
      selectable && 'm-is-selectable',
      selected && 'm-is-selected',
    )}
    isClickable={selectable}
    isClicked={selected}
    {...rest}
  />
);

export default TypeBorderedCard;
