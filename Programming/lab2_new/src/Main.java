import ru.ifmo.se.pokemon.Battle;
import pokemons.*;

//Сформировать при запуске вывод о использовании умений
public class Main {
    public static void main(String[] args) {
        Battle battle = new Battle();
        battle.addAlly((new Lunatone("Moon", 73)));
        battle.addAlly((new Seel("Cat", 65)));
        battle.addAlly((new Swinub("Browny", 81)));
        battle.addFoe((new Dewgong("Big Cat", 56)));
        battle.addFoe((new Piloswine("Bizon", 76)));
        battle.addFoe((new Mamoswine("Rhino", 79)));
        battle.go();
    }
}