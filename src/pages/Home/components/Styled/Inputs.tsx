import { TextField, FormControl } from '@material-ui/core'

import { withStyles } from '@material-ui/core/styles'

export const StyledTextField = withStyles({
  root: {
    '& label.Mui': {
      color: '#6C5DD3',
    },
    '& label.Mui-focused': {
      color: '#6C5DD3',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#EEF0F9',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#EEF0F9',
      },
      '&:hover fieldset': {
        borderColor: '#EEF0F9',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6C5DD3',
      },
    },
  },
})(TextField)

export const StyledFormControl = withStyles({
  root: {
    '& label.Mui': {
      color: '#6C5DD3',
    },
    '& label.Mui-focused': {
      color: '#6C5DD3',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#EEF0F9',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#EEF0F9',
        background: 'none',
      },
      '&:hover fieldset': {
        borderColor: '#EEF0F9',
        background: 'none',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6C5DD3',
        background: 'none',
      },
    },
    '& .MuiFormHelperText-root': {
      marginLeft: 0,
      marginRight: 0,
    },
  },
})(FormControl)
