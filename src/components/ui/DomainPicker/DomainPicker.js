import React, { useState, useEffect } from "react";
import DomainTable from "./DomainTable";
import {
  Button,
  Modal,
  Box,
  Typography,
  IconButton,
  Card,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function DomainPicker({
  onSelect,
  domainList,
  domainSelect,
  buttonName = "Select Domain",
  variant = "contained",
  size = "",
  show = false,
}) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  return (
    <>
      <Button
        variant={variant}
        color="secondary"
        onClick={() => setShowModal(true)}
        size={size}
      >
        {buttonName}
      </Button>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: 4,
          }}
        >
          <Box
            sx={{
              paddingBottom: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                paddingRight: 4,
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: "14pt" }}>
                Choose from domain list
              </Typography>
              <Typography
                sx={{
                  fontWeight: 300,
                  fontSize: "12pt",
                }}
              >
                Choosing a domain will update your google property id. This
                change updates production when your cache is refreshed
              </Typography>
            </Box>
            <Box>
              <IconButton
                color="secondary"
                aria-label="upload picture"
                component="button"
                onClick={() => setShowModal(false)}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          </Box>

          <DomainTable
            domains={domainList}
            onCellClick={onSelect}
            selectedDomain={domainSelect}
          />
        </Card>
      </Modal>
    </>
  );
}
