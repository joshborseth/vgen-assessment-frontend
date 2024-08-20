import styled from "styled-components";
import { Colours, Typography } from "../definitions";

export default styled.div`
  width: 100%;

  .content {
    h1 {
      color: ${Colours.BLACK};
      font-size: ${Typography.HEADING_SIZES.M};
      font-weight: ${Typography.WEIGHTS.LIGHT};
      line-height: 2.625rem;
      margin-bottom: 2rem;
      margin-top: 1rem;
    }

    .saveButton {
      margin-top: 1rem;
    }
  }
`;
