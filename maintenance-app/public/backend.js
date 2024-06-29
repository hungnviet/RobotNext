const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json()); // This middleware is used to parse JSON bodies

app.listen(3001, () => console.log("Server listening on port12 3001"));

///message BE
app.get("/list_spare_parts_need_to_buy", (req, res) => {
  fs.readFile(
    path.join(__dirname, "../../Data/messageDataForBuy.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        res.json(JSON.parse(data));
      }
    }
  );
});

app.delete("/list_spare_parts_need_to_buy", async (req, res) => {
  const messageIdToDelete = req.body.id;

  fs.readFile(
    path.join(__dirname, "../../Data/messageDataForBuy.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        let messages = JSON.parse(data);
        const index = messages.findIndex(
          (message) => message.message_id === messageIdToDelete
        );

        if (index !== -1) {
          messages.splice(index, 1);

          fs.writeFile(
            path.join(__dirname, "../../Data/messageDataForBuy.json"),
            JSON.stringify(messages, null, 2),
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error writing file");
              } else {
                res.json({ status: "success", message: "Message deleted" });
              }
            }
          );
        } else {
          res
            .status(404)
            .json({ status: "error", message: "Message not found" });
        }
      }
    }
  );
});

///----------------------------------------------------------------------------------------------------------------
///spare part BE

app.get("/list_spare_parts", (req, res) => {
  fs.readFile(
    path.join(__dirname, "../../Data/sparePartData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        res.json(JSON.parse(data));
      }
    }
  );
});

app.post("/list_spare_parts", async (req, res) => {
  const newSparePart = req.body.newSparePart;
  fs.readFile(
    path.join(__dirname, "../../Data/sparePartData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        let curSparePart = JSON.parse(data);
        const listForCheckExists = curSparePart.filter(
          (item) => item.spare_part_code === newSparePart.spare_part_code
        );
        if (listForCheckExists.length > 0) {
          res
            .status(400)
            .json({ status: "error", message: "Spare part already exists" });
        } else {
          curSparePart.push(newSparePart);
          fs.writeFile(
            path.join(__dirname, "../../Data/sparePartData.json"),
            JSON.stringify(curSparePart, null, 2),
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error writing file");
              } else {
                res.json({ status: "success", message: "Spare part added" });
              }
            }
          );
        }
      }
    }
  );
});

app.put("/list_spare_parts", async (req, res) => {
  const updatedSparePart = req.body;
  const {
    spare_part_code,
    new_spare_part_suplier,
    new_delivery_time,
    new_inventory_quantity,
    new_unit_price,
  } = updatedSparePart;

  fs.readFile(
    path.join(__dirname, "../../Data/sparePartData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        let curSparePart = JSON.parse(data);
        const index = curSparePart.findIndex(
          (sparePart) => sparePart.spare_part_code === spare_part_code
        );
        if (index !== -1) {
          curSparePart[index].spare_part_suplier = new_spare_part_suplier;
          curSparePart[index].delivery_time = new_delivery_time;
          curSparePart[index].inventory_quantity = new_inventory_quantity;
          curSparePart[index].unit_price = new_unit_price;
          fs.writeFile(
            path.join(__dirname, "../../Data/sparePartData.json"),
            JSON.stringify(curSparePart, null, 2),
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error writing file");
              } else {
                res.json({ status: "success", message: "Spare part updated" });
              }
            }
          );
        } else {
          res
            .status(404)
            .json({ status: "error", message: "Spare part not found" });
        }
      }
    }
  );
});

app.delete("/list_spare_parts", async (req, res) => {
  const sparePartCodeToDelete = req.body.spare_part_code;

  fs.readFile(
    path.join(__dirname, "../../Data/sparePartData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        let spareParts = JSON.parse(data);
        const index = spareParts.findIndex(
          (sparePart) => sparePart.spare_part_code === sparePartCodeToDelete
        );

        if (index !== -1) {
          spareParts.splice(index, 1);

          fs.writeFile(
            path.join(__dirname, "../../Data/sparePartData.json"),
            JSON.stringify(spareParts, null, 2),
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error writing file");
              } else {
                res.json({ status: "success", message: "Spare part deleted" });
              }
            }
          );
        } else {
          res
            .status(404)
            .json({ status: "error", message: "Spare part not found" });
        }
      }
    }
  );
});

///----------------------------------------------------------------------------------------------------------------
///machine BE
app.get("/list_machines", (req, res) => {
  fs.readFile(
    path.join(__dirname, "../../Data/machineData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        res.json(JSON.parse(data));
      }
    }
  );
});
