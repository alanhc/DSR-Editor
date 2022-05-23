import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Skeleton,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CopyIcon from "@mui/icons-material/ContentCopyRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteRoom } from "../utils/axios";
import { LoadingContext } from "../utils/context";

const RoomListItem = ({ room, refetch }) => {
  const { image, name, id } = room ?? {};
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);
  const [isShowingConfirmDelete, setIsShowingConfirmDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const navigate = useNavigate();
  const skeleton = !name;

  const onClickCopy = () => {
    navigator.clipboard.writeText(id).then(() => {
      setIsSnackbarOpen(true);
    });
  };

  const onClickEdit = () => {
    navigate(id);
  };

  const onClickDelete = () => {
    setIsShowingConfirmDelete(true);
  };

  const onConfirmDelete = () => {
    setIsShowingConfirmDelete(false);
    setIsLoading(true);
    deleteRoom(id).then(() => {
      refetch?.().then(() => {
        setIsLoading(false);
      });
    });
  };

  return (
    <>
      <Card sx={{ width: 360, margin: 2, height: "max-content" }} raised>
        <Box
          sx={{
            width: "100%",
            height: "auto",
            aspectRatio: "15/9",
            position: "relative",
            backgroundColor: "background.paper",
          }}
        >
          {!skeleton && (
            <CardMedia
              component="img"
              loading="lazy"
              sx={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                zIndex: 1,
                position: "absolute",
                top: 0,
              }}
              onLoad={() => {
                setIsLoaded(true);
              }}
              image={
                (image?.length ?? 0) > 0
                  ? image
                  : "/DSR-Editor/images/default.png"
              }
            />
          )}
          {!isLoaded && (
            <Skeleton
              sx={{
                zIndex: 0,
                position: "absolute",
                top: 0,
              }}
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
            />
          )}
        </Box>
        <CardContent
          sx={{
            pt: 1,
            "&:last-child": {
              paddingBottom: { sm: 1.5, xs: 1 },
            },
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 0.5,
              lineHeight: 1.6,
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {skeleton ? <Skeleton /> : name}
          </Typography>
          {skeleton ? (
            <Skeleton width="40%" />
          ) : (
            <Tooltip title="Click to copy" arrow followCursor>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { sm: "0.875rem", xs: "0.75rem" },
                  width: "fit-content",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  cursor: "pointer",
                  lineHeight: 1,
                  "&:hover": {
                    color: "text.primary",
                    textDecoration: "underline dotted 2px",
                  },
                }}
                onClick={onClickCopy}
              >
                <CopyIcon
                  fontSize="small"
                  sx={{ mr: 0.5, fontSize: { sm: "1.25rem", xs: "1rem" } }}
                />
                {id}
              </Typography>
            </Tooltip>
          )}
          {!skeleton && (
            <>
              <Tooltip
                title="Delete"
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    style: {
                      marginBottom: 8,
                    },
                  },
                }}
              >
                <IconButton
                  color="error"
                  size="small"
                  sx={{
                    position: "absolute",
                    right: { sm: 48, xs: 40 },
                    bottom: { sm: 8, xs: 4 },
                  }}
                  onClick={onClickDelete}
                >
                  <DeleteIcon
                    sx={{ fontSize: { sm: "1.5rem", xs: "1.25rem" } }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Edit"
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    style: {
                      marginBottom: 8,
                    },
                  },
                }}
              >
                <IconButton
                  color="primary"
                  size="small"
                  sx={{
                    position: "absolute",
                    right: 8,
                    bottom: { sm: 8, xs: 4 },
                  }}
                  onClick={onClickEdit}
                >
                  <EditIcon
                    sx={{ fontSize: { sm: "1.5rem", xs: "1.25rem" } }}
                  />
                </IconButton>
              </Tooltip>
            </>
          )}
        </CardContent>
      </Card>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={useCallback(() => {
          setIsSnackbarOpen(false);
        }, [])}
        message="Room ID copied."
        sx={{
          "& .MuiPaper-root": {
            maxWidth: "max-content",
            minWidth: "max-content",
            pl: 3,
            pr: 3,
          },
        }}
      />
      <Dialog open={isShowingConfirmDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Are you sure to delete the room?</DialogTitle>
        <DialogContent>
          <DialogContentText component="span">
            Type the room name{" "}
            <Typography component="span" color="error" fontWeight="bold">
              {name}
            </Typography>
          </DialogContentText>
          <TextField
            variant="standard"
            fullWidth
            value={confirmText}
            onChange={useCallback((e) => {
              setConfirmText(e.target.value);
            }, [])}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={useCallback(() => {
              setIsShowingConfirmDelete(false);
            }, [])}
          >
            Cancel
          </Button>
          <Button
            color="error"
            disabled={confirmText !== name}
            onClick={onConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomListItem;
