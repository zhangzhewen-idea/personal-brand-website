package com.zhangzhewen.pbw;

import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class ArchitectureTest {

    private final com.tngtech.archunit.core.domain.JavaClasses classes = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.zhangzhewen.pbw");

    @Test
    void colaDependenciesRemainOneWay() {
        noClasses().that().resideInAPackage("..domain..").should().dependOnClassesThat().resideInAnyPackage("..adapter..", "..application..", "..infrastructure..").check(classes);
        noClasses().that().resideInAPackage("..application..").should().dependOnClassesThat().resideInAPackage("..infrastructure..").check(classes);
        noClasses().that().resideInAPackage("..adapter..").should().dependOnClassesThat().resideInAPackage("..infrastructure..").check(classes);
        noClasses().that().resideInAPackage("..infrastructure..").should().dependOnClassesThat().resideInAnyPackage("..adapter..", "..application..").check(classes);
    }

    @Test
    void adapterNamesExposeTheirAudience() {
        classes().that().resideInAPackage("..adapter.admin..").should().haveSimpleNameStartingWith("Admin").check(classes);
        classes().that().resideInAPackage("..adapter.user..").should().haveSimpleNameStartingWith("User").check(classes);
    }
}
