package code;

import code.buildings.Drainpipe;
import code.buildings.Gazebo;
import code.buildings.House;
import code.buildings.Roof;
import code.characters.Action;
import code.characters.Gender;
import code.characters.ShortyGroup;
import code.characters.Znayka;
import code.environment.Wind;
import code.exceptions.DrainpipeNotFoundException;
import code.exceptions.GroupNumberException;
import code.exceptions.WindBlowException;
import code.items.Rope;

import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Znayka znayka = new Znayka(Gender.MALE, "земля", 1.9, 85.0, 110);

        List<ShortyGroup> shorties = new ArrayList<>();
        shorties.add(new ShortyGroup(Gender.MALE, "около дома", 1.4, 30.0, 70));
        shorties.add(new ShortyGroup(Gender.MALE, "около дома", 1.4, 30.0, 70));
        shorties.add(new ShortyGroup(Gender.MALE, "около дома", 1.4, 30.0, 70));
        Rope rope = new Rope();
        Gazebo gazebo = new Gazebo("Беседка");
        House house = new House("Дом");
        Drainpipe drainpipe = new Drainpipe(house);
        Roof roof = new Roof(house);
        Wind wind = new Wind();
        StringBuilder output = new StringBuilder();


        output.append(znayka.jump());
        znayka.setPositionAlias("беседка");
        //gazebo.addResident("Lein");
        if (gazebo.getResidents() == 0) {
            output.append("Винтика и там не было.\n");
        } else {
            output.append(znayka.getName() + " " + znayka.getActionGenderText(Action.SAW) + " других жильцов, но не Винтика.\n");
        }
        output.append("Все " + shorties.size() + " коротышки крепко взялись за " + rope.getQuality().getRussianDescription() + " веревку.\n");
        try {
            if (shorties.isEmpty()) {
                throw new GroupNumberException("Группа коротышек пуста.");
            }
            output.append(shorties.get(0).pullRope(znayka, rope));
        } catch (GroupNumberException e) {
            output.append(e.getMessage() + "\n");
        }
        try {
            output.append(znayka.climb(drainpipe));
        } catch (DrainpipeNotFoundException e) {
            output.append(e.getMessage() + "\n");
        }
        try {
            if (znayka.getPositionAlias().equals("крыша")) {

                if (wind.getWillBlow()) {
                    output.append("высота была около " + house.getHeight() + " этажей,но налетевший сильный порыв ветра сдул " + znayka.getActionGenderText(Action.PRONOUNS_HIS) + " с крыши и понес в " + wind.getWindDirection().getDirectionName() + " сторону.\n");
                } else {
                    output.append("высота была около " + house.getHeight() + " этажей,но легкий ветерок слегка пошатнул " + znayka.getActionGenderText(Action.PRONOUNS_HIS) + ".\n");
                }
                if (znayka.getHeartBeatFrequency() < 120) {
                    output.append("Это не испугало " + znayka.getName() + ", так как " + znayka.getActionGenderText(Action.PRONOUNS_HE) + " " + znayka.getActionGenderText(Action.KNOW) + ", что коротышки в любой момент могут притянуть " + znayka.getActionGenderText(Action.PRONOUNS_HIS) + " на веревке обратно.\n");
                } else {
                    output.append(znayka.getName() + " сильно нервничал, но все равно " + znayka.getActionGenderText(Action.PRONOUNS_HE) + " " + znayka.getActionGenderText(Action.KNOW) + ", что коротышки в любой момент могут притянуть " + znayka.getActionGenderText(Action.PRONOUNS_HIS) + " на веревке обратно.\n");

                }
            }
        } catch (WindBlowException e) {
            output.append(e.getMessage() + "\n");
        } catch (NullPointerException e) {
            output.append("NullPointerException была поймана: " + e.getMessage() + "\n");
        }


        if (znayka.isFlying()) {
            for (ShortyGroup shorty : shorties) {
                shorty.pullRope(znayka, rope);
            }
        }

        System.out.println(output);
    }
}